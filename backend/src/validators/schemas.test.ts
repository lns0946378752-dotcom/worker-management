import assert from "node:assert/strict";
import test from "node:test";

import {
  companySchema,
  listQuerySchema,
  registerSchema,
  uuidParam,
} from "./schemas.js";

test("identifiers accept SQL Server GUIDs (not RFC 4122 versions) and reject malformed values", () => {
  for (const value of ["2f9d3a10-0b4e-f011-8c3d-00155d01aa01", "5C2E1F21-9A4B-F011-A8C4-0A0027000011", "11111111-1111-1111-1111-111111111111"]) {
    assert.equal(uuidParam.safeParse(value).success, true, value);
  }
  for (const value of ["not-a-uuid", "", "a0000000-0000-4000-8000-00000000000g", "a0000000-0000-4000-8000-0000000000011"]) {
    assert.equal(uuidParam.safeParse(value).success, false, value);
  }
});

test("registration rejects a weak password", () => {
  const result = registerSchema.safeParse({
    fullName: "Test User",
    email: "test@example.com",
    password: "short",
  });
  assert.equal(result.success, false);
});

test("registration rejects a password exceeding bcrypt's UTF-8 byte limit", () => {
  const result = registerSchema.safeParse({
    fullName: "Test User",
    email: "test@example.com",
    password: "Ã¡".repeat(37),
  });
  assert.equal(result.success, false);
});

test("registration normalizes surrounding whitespace", () => {
  const result = registerSchema.parse({
    fullName: "  Test User  ",
    email: "  test@example.com  ",
    password: "long-enough-password",
  });
  assert.equal(result.fullName, "Test User");
  assert.equal(result.email, "test@example.com");
});

test("list query applies defaults and rejects excessive page sizes", () => {
  assert.equal(listQuerySchema.parse({}).pageSize, 10);
  assert.equal(listQuerySchema.safeParse({ pageSize: "1000" }).success, false);
});

test("company input requires a district", () => {
  const result = companySchema.safeParse({ name: "Example Co." });
  assert.equal(result.success, false);
});
