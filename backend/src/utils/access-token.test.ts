import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import jwt from "jsonwebtoken";

import { HttpError } from "./http-error.js";
import { assertJwtConfiguration, signAccessToken, verifyAccessToken } from "./access-token.js";

const testSecret = "worker-management-test-secret-at-least-32-characters";
const originalSecret = process.env.JWT_SECRET;

before(() => {
  process.env.JWT_SECRET = testSecret;
});

after(() => {
  if (originalSecret === undefined) {
    delete process.env.JWT_SECRET;
  } else {
    process.env.JWT_SECRET = originalSecret;
  }
});

test("access token carries the user subject and expected issuer and audience", () => {
  const token = signAccessToken({ id: "user-123", email: "user@example.test" });
  const claims = verifyAccessToken(token);

  assert.equal(claims.sub, "user-123");
  assert.equal(claims.email, "user@example.test");
  assert.equal(claims.iss, "worker-management");
  assert.equal(claims.aud, "worker-management-web");
  assert.equal(claims.exp! - claims.iat!, 60 * 60);
});

test("access token verification rejects a token with a different signature", () => {
  const token = jwt.sign({ email: "user@example.test" }, "another-secret-that-is-also-long-enough", {
    subject: "user-123",
    issuer: "worker-management",
    audience: "worker-management-web",
    expiresIn: "1h",
    algorithm: "HS256",
  });

  assert.throws(() => verifyAccessToken(token));
});

test("access token verification rejects a token with the wrong issuer", () => {
  const token = jwt.sign({ email: "user@example.test" }, testSecret, {
    subject: "user-123",
    issuer: "different-issuer",
    audience: "worker-management-web",
    expiresIn: "1h",
    algorithm: "HS256",
  });

  assert.throws(() => verifyAccessToken(token));
});

test("access token verification rejects a token with the wrong audience", () => {
  const token = jwt.sign({ email: "user@example.test" }, testSecret, {
    subject: "user-123",
    issuer: "worker-management",
    audience: "different-client",
    expiresIn: "1h",
    algorithm: "HS256",
  });

  assert.throws(() => verifyAccessToken(token));
});

test("access token verification rejects expired tokens", () => {
  const token = jwt.sign({ email: "user@example.test" }, testSecret, {
    subject: "user-123",
    issuer: "worker-management",
    audience: "worker-management-web",
    expiresIn: -1,
    algorithm: "HS256",
  });

  assert.throws(() => verifyAccessToken(token), jwt.TokenExpiredError);
});

test("access token verification rejects tokens without required identity claims", () => {
  const token = jwt.sign({}, testSecret, {
    subject: "user-123",
    issuer: "worker-management",
    audience: "worker-management-web",
    expiresIn: "1h",
    algorithm: "HS256",
  });

  assert.throws(
    () => verifyAccessToken(token),
    (error: unknown) => error instanceof HttpError && error.statusCode === 401
  );
});

test("JWT configuration rejects missing or weak secrets", () => {
  delete process.env.JWT_SECRET;
  assert.throws(() => assertJwtConfiguration(), /at least 32 characters/);
  process.env.JWT_SECRET = "too-short";
  assert.throws(() => assertJwtConfiguration(), /at least 32 characters/);
  process.env.JWT_SECRET = testSecret;
  assert.doesNotThrow(() => assertJwtConfiguration());
});
