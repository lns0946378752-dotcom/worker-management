import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { randomUUID } from "node:crypto";
import type { AddressInfo } from "node:net";

import { User, sequelize } from "../models/index.js";
import app from "../app.js";

const testEmail = `auth-integration-${randomUUID()}@example.test`;
const testPassword = "Integration-test-password-42";
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;
let baseUrl: string;
let server: ReturnType<typeof app.listen>;
let userToken: string;
let adminToken: string;
let databaseReady = false;

async function request(path: string, init?: RequestInit) {
  return fetch(`${baseUrl}${path}`, init);
}

async function readJson(response: Response) {
  return response.json() as Promise<Record<string, unknown>>;
}

before(async () => {
  if (!adminEmail || !adminPassword) {
    throw new Error("Cần cấu hình ADMIN_EMAIL và ADMIN_PASSWORD trong môi trường local để chạy kiểm thử tích hợp.");
  }

  await sequelize.authenticate();
  databaseReady = true;
  server = app.listen(0);
  await new Promise<void>((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });

  const address = server.address() as AddressInfo;
  baseUrl = `http://127.0.0.1:${address.port}/api`;
});

after(async () => {
  if (server) {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve());
    });
  }
  if (databaseReady) {
    await User.destroy({ where: { email: [testEmail, `long-${testEmail}`] } });
    await sequelize.close();
  }
});

test("valid registration persists a regular user and returns an access token", async () => {
  const response = await request("/auth/register", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      fullName: "  Integration Test User  ",
      email: `  ${testEmail.toUpperCase()}  `,
      password: testPassword,
    }),
  });
  const body = await readJson(response);
  const user = body.user as { id: string; fullName: string; email: string; role: string; passwordHash?: string };

  assert.equal(response.status, 201);
  assert.equal(user.fullName, "Integration Test User");
  assert.equal(user.email, testEmail);
  assert.equal(user.role, "user");
  assert.equal(user.passwordHash, undefined);
  assert.equal(typeof body.token, "string");

  userToken = body.token as string;
  const storedUser = await User.findByPk(user.id);
  assert.ok(storedUser);
  assert.notEqual(storedUser.passwordHash, testPassword);
  assert.match(storedUser.passwordHash, /^\$2[aby]\$/);
});

test("registration rejects malformed fields with Vietnamese messages and does not save an account", async () => {
  const response = await request("/auth/register", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ fullName: "", email: "not-an-email", password: "short" }),
  });
  const body = await readJson(response);

  assert.equal(response.status, 400);
  assert.match(body.message as string, /[À-ỹ]/);
  assert.equal(body.details, undefined);
  assert.equal(await User.count({ where: { email: testEmail } }), 1);
});

test("registration rejects passwords exceeding bcrypt's UTF-8 byte limit", async () => {
  const response = await request("/auth/register", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      fullName: "Long Password Test",
      email: `long-${testEmail}`,
      password: "á".repeat(37),
    }),
  });

  assert.equal(response.status, 400);
  assert.match(((await readJson(response)).message as string), /72 byte/);
});

test("registration rejects a duplicate email regardless of letter case", async () => {
  const response = await request("/auth/register", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      fullName: "Duplicate Test",
      email: testEmail.toUpperCase(),
      password: testPassword,
    }),
  });

  assert.equal(response.status, 409);
  assert.match(((await readJson(response)).message as string), /đã được đăng ký/);
  assert.equal(await User.count({ where: { email: testEmail } }), 1);
});

test("login accepts normalized email and rejects unknown email or wrong password", async () => {
  const validResponse = await request("/auth/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: ` ${testEmail.toUpperCase()} `, password: testPassword }),
  });
  const validBody = await readJson(validResponse);

  assert.equal(validResponse.status, 200);
  assert.equal((validBody.user as { role: string }).role, "user");
  assert.equal(typeof validBody.token, "string");

  for (const credentials of [
    { email: testEmail, password: "incorrect-password" },
    { email: `missing-${testEmail}`, password: testPassword },
  ]) {
    const response = await request("/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(credentials),
    });

    assert.equal(response.status, 401);
    assert.match(((await readJson(response)).message as string), /chưa chính xác/);
  }
});

test("current-user endpoint accepts a valid token and rejects missing or invalid tokens", async () => {
  const valid = await request("/auth/me", { headers: { authorization: `Bearer ${userToken}` } });
  assert.equal(valid.status, 200);
  assert.equal(((await readJson(valid)).user as { email: string }).email, testEmail);

  for (const authorization of [undefined, "Bearer invalid-token"]) {
    const response = await request("/auth/me", {
      headers: authorization ? { authorization } : {},
    });
    assert.equal(response.status, 401);
    assert.match(((await readJson(response)).message as string), /đăng nhập|không hợp lệ/i);
  }
});

test("a regular user cannot access administrator endpoints", async () => {
  for (const path of ["/dashboard", "/applications"]) {
    const response = await request(path, { headers: { authorization: `Bearer ${userToken}` } });
    assert.equal(response.status, 403);
    assert.match(((await readJson(response)).message as string), /không có quyền/);
  }

  const missingToken = await request("/dashboard");
  assert.equal(missingToken.status, 401);
});

test("administrator login and dashboard access work; wrong password is refused", async () => {
  const invalidResponse = await request("/auth/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: adminEmail, password: `${adminPassword}-wrong` }),
  });
  assert.equal(invalidResponse.status, 401);

  const response = await request("/auth/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: adminEmail, password: adminPassword }),
  });
  const body = await readJson(response);

  assert.equal(response.status, 200);
  assert.equal((body.user as { role: string }).role, "admin");
  adminToken = body.token as string;

  const dashboardResponse = await request("/dashboard", {
    headers: { authorization: `Bearer ${adminToken}` },
  });
  assert.equal(dashboardResponse.status, 200);
});

test("login rate limit returns a Vietnamese response after the configured threshold", async () => {
  let lastResponse: Response | undefined;
  for (let attempt = 0; attempt < 11; attempt += 1) {
    lastResponse = await request("/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: `rate-${testEmail}`, password: "incorrect-password" }),
    });
  }

  assert.equal(lastResponse?.status, 429);
  assert.match(((await readJson(lastResponse!)).message as string), /chờ 15 phút/);
});
