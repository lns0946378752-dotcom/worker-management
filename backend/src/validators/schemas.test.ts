import assert from "node:assert/strict";
import test from "node:test";

import {
  applicationSchema,
  companySchema,
  listQuerySchema,
  registerSchema,
  vacancySchema,
} from "./schemas.js";

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
    password: "á".repeat(37),
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

test("vacancy rejects an age range where minimum exceeds maximum", () => {
  const result = vacancySchema.safeParse({
    companyId: "a9f3de45-ea0c-4f2b-86d4-0a7827fbd86f",
    department: "Assembly",
    title: "Operator",
    quantity: 5,
    workHours: "08:00–17:00",
    baseSalary: 8_000_000,
    minimumAge: 40,
    maximumAge: 20,
  });
  assert.equal(result.success, false);
});

test("application rejects a birth year outside working-age validation", () => {
  const result = applicationSchema.safeParse({
    vacancyId: "a9f3de45-ea0c-4f2b-86d4-0a7827fbd86f",
    applicantName: "Test User",
    phone: "0900000000",
    yearOfBirth: 2015,
    gender: "male",
  });
  assert.equal(result.success, false);
});

test("list query applies defaults and rejects excessive page sizes", () => {
  assert.equal(listQuerySchema.parse({}).pageSize, 10);
  assert.equal(listQuerySchema.safeParse({ pageSize: "1000" }).success, false);
});

test("company input requires a district", () => {
  const result = companySchema.safeParse({ name: "Example Co." });
  assert.equal(result.success, false);
});
