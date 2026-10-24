import type { NextFunction, Request, Response } from "express";

import { User, type UserRole } from "../models/index.js";
import { HttpError } from "../utils/http-error.js";
import { verifyAccessToken } from "../utils/access-token.js";

export async function authenticate(
  request: Request,
  _response: Response,
  next: NextFunction
) {
  const authorization = request.header("authorization");
  const token = authorization?.match(/^Bearer\s+(.+)$/i)?.[1].trim();

  if (!token) {
    next(new HttpError(401, "A valid bearer token is required."));
    return;
  }

  let userId: string;
  try {
    userId = verifyAccessToken(token).sub;
  } catch (error) {
    next(error instanceof HttpError ? error : new HttpError(401, "The bearer token is invalid or expired."));
    return;
  }

  try {
    const user = await User.findByPk(userId, { attributes: ["id", "email", "role"] });
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
