import assert from "node:assert/strict";
import test from "node:test";

import { getOrder, getPagination, getPaginationResponse } from "./pagination.js";

test("pagination defaults to the first page and ten items", () => {
  assert.deepEqual(getPagination(undefined, undefined), {
    page: 1,
    pageSize: 10,
    offset: 0,
    limit: 10,
  });
});

test("pagination computes the offset from page and page size", () => {
  assert.equal(getPagination("3", "20").offset, 40);
});

test("pagination rejects invalid values and unbounded page sizes", () => {
  assert.throws(() => getPagination("-1", "10"), { statusCode: 400 });
  assert.throws(() => getPagination("1", "101"), { statusCode: 400 });
});

test("pagination response reports the correct page count", () => {
  const page = getPagination("2", "10");
  assert.deepEqual(getPaginationResponse(21, page), {
    page: 2,
    pageSize: 10,
    totalItems: 21,
    totalPages: 3,
  });
});

test("sort fields are allowlisted and direction is normalized", () => {
  assert.deepEqual(getOrder("name:desc", ["name", "createdAt"], "name"), [["name", "DESC"]]);
  assert.throws(() => getOrder("untrustedField:desc", ["name"], "name"), { statusCode: 400 });
});
