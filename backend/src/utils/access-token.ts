import jwt, { type JwtPayload, type VerifyOptions } from "jsonwebtoken";

import { HttpError } from "./http-error.js";

const issuer = "worker-management";
const audience = "worker-management-web";
const tokenOptions: VerifyOptions = {
  issuer,
  audience,
  algorithms: ["HS256"],
};

type AccessTokenClaims = JwtPayload & { sub: string; email: string };

function hasAccessTokenClaims(claims: JwtPayload | string): claims is AccessTokenClaims {
  return (
    typeof claims === "object" &&
    claims !== null &&
    typeof claims.sub === "string" &&
    claims.sub.length > 0 &&
    typeof claims.email === "string" &&
    claims.email.length > 0
  );
}

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

export function signAccessToken(user: { id: string; email: string }) {
  return jwt.sign(
    { email: user.email },
    jwtSecret(),
    {
      subject: user.id,
      issuer,
      audience,
      expiresIn: "1h",
      algorithm: "HS256",
    }
  );
}

export function verifyAccessToken(token: string): AccessTokenClaims {
  const claims = jwt.verify(token, jwtSecret(), { ...tokenOptions, complete: false });
  if (!hasAccessTokenClaims(claims)) {
    throw new HttpError(401, "Phiên đăng nhập không hợp lệ hoặc đã hết hạn.");
  }

  return claims;
}
