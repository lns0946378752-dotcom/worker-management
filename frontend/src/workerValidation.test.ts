import assert from "node:assert/strict";
import test from "node:test";

import { emptyWorkerForm, toWorkerPayload, validateWorkerForm, type WorkerFormValues } from "./workerValidation";

const valid: WorkerFormValues = { ...emptyWorkerForm, fullName: "Nguyễn Văn A", dateOfBirth: "1995-05-20", phone: "0901234567", gender: "male" };
const today = new Date("2026-06-01T00:00:00Z");

test("valid minimal form has no errors", () => {
  assert.deepEqual(validateWorkerForm(valid, today), {});
});

test("required fields are reported", () => {
  const errors = validateWorkerForm(emptyWorkerForm, today);
  assert.deepEqual(Object.keys(errors).sort(), ["dateOfBirth", "fullName", "gender", "phone"]);
});

test("age, date, national id and bank account rules", () => {
  assert.ok(validateWorkerForm({ ...valid, dateOfBirth: "2015-01-01" }, today).dateOfBirth);
  assert.ok(validateWorkerForm({ ...valid, dateOfBirth: "1995-02-30" }, today).dateOfBirth);
  assert.ok(validateWorkerForm({ ...valid, nationalId: "12345" }, today).nationalId);
  assert.ok(validateWorkerForm({ ...valid, nationalId: "123456789012" }, today).nationalId === undefined);
  assert.ok(validateWorkerForm({ ...valid, bankAccountNumber: "12ab56" }, today).bankAccountNumber);
  assert.ok(validateWorkerForm({ ...valid, idIssueDate: "2020-13-01" }, today).idIssueDate);
});

test("payload nulls blanks and only sends saleUserId for admin", () => {
  const payload = toWorkerPayload({ ...valid, fullName: "  A  ", saleUserId: "x" }, false);
  assert.equal(payload.fullName, "A");
  assert.equal(payload.note, null);
  assert.ok(!("saleUserId" in payload));
  assert.equal(toWorkerPayload({ ...valid, saleUserId: "" }, true).saleUserId, null);
});
