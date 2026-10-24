import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

import { User, type UserRole } from "../models/index.js";
import { HttpError } from "../utils/http-error.js";

type AccessTokenClaims = JwtPayload & { sub: string; email: string };

function jwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET must contain at least 32 characters.");
  }

  return secret;
}

export function assertJwtConfiguration() {
  jwtSecret();
}

export function signAccessToken(user: Pick<User, "id" | "email" | "role">) {
  return jwt.sign(
    { email: user.email },
    jwtSecret(),
    {
      subject: user.id,
      issuer: "worker-management",
      audience: "worker-management-web",
      expiresIn: "8h",
      algorithm: "HS256",
    }
  );
}

export async function authenticate(
  request: Request,
  _response: Response,
  next: NextFunction
) {
  const authorization = request.header("authorization");
  const token = authorization?.startsWith("Bearer ") ? authorization.slice(7) : undefined;

  if (!token) {
    next(new HttpError(401, "A valid bearer token is required."));
    return;
  }

  let claims: AccessTokenClaims;
  try {
    claims = jwt.verify(token, jwtSecret(), {
      issuer: "worker-management",
      audience: "worker-management-web",
      algorithms: ["HS256"],
    }) as AccessTokenClaims;
  } catch (error) {
    next(error instanceof HttpError ? error : new HttpError(401, "The bearer token is invalid or expired."));
    return;
  }

  try {
    const user = await User.findByPk(claims.sub, { attributes: ["id", "email", "role"] });
    if (!user) {
      next(new HttpError(401, "The account for this token no longer exists."));
      return;
    }

    request.auth = { id: user.id, email: user.email, role: user.role };
    next();
  } catch (error) {
    next(error);
  }
}

export function requireRole(...allowedRoles: UserRole[]) {
  return (request: Request, _response: Response, next: NextFunction) => {
    if (!request.auth) {
      next(new HttpError(401, "Sign-in is required."));
      return;
    }

    if (!allowedRoles.includes(request.auth.role)) {
      next(new HttpError(403, "Your account does not have permission for this action."));
      return;
    }

    next();
  };
}
