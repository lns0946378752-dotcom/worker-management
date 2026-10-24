import jwt from "jsonwebtoken";
import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

import type { UserRecord } from "@/lib/types";

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured.");
  }

  return secret;
}

export type JwtPayload = {
  sub: string;
  email: string;
  role: UserRecord["role"];
};

export function signUserToken(user: UserRecord) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
    },
    getJwtSecret(),
    { expiresIn: "7d" }
  );
}

export function verifyUserToken(token: string) {
  try {
    return jwt.verify(token, getJwtSecret()) as JwtPayload;
  } catch {
    return null;
  }
}

// Password hashing helpers using scrypt
export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, stored: string) {
  if (!stored) return false;
  const parts = stored.split(":");
  if (parts.length !== 2) return false;
  const [salt, key] = parts;
  try {
    const derived = scryptSync(password, salt, 64);
    const keyBuf = Buffer.from(key, "hex");
    if (keyBuf.length !== derived.length) return false;
    return timingSafeEqual(derived, keyBuf);
  } catch {
    return false;
  }
}
