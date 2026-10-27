import assert from "node:assert/strict";
import test from "node:test";

import type { Account } from "./api";
import { readToken, resolveView, restoreSession, selectStorage, SESSION_TOKEN_KEY, writeToken, type TokenStorage } from "./session";

const throwingStorage: TokenStorage = {
  getItem: () => null,
  setItem: () => {
    throw new Error("blocked");
  },
  removeItem: () => {
    throw new Error("blocked");
  },
};

function mapStorage(): TokenStorage {
  const data = new Map<string, string>();
  return {
    getItem: (k) => data.get(k) ?? null,
    setItem: (k, v) => void data.set(k, v),
    removeItem: (k) => void data.delete(k),
  };
}

test("writeToken reports failure when storage is blocked and success otherwise", () => {
  assert.equal(writeToken(throwingStorage, "t"), false);
  const ok = mapStorage();
  assert.equal(writeToken(ok, "t"), true);
  assert.equal(readToken(ok), "t");
  assert.equal(writeToken(ok, null), true);
  assert.equal(readToken(ok), null);
});

test("selectStorage falls back to the next usable storage, then to non-persistent memory", () => {
  const good = mapStorage();
  assert.equal(selectStorage([() => throwingStorage, () => good]).storage, good);
  const none = selectStorage([() => throwingStorage, () => { throw new Error("denied"); }]);
  assert.equal(none.persistent, false);
});

function memoryStorage(initial: Record<string, string> = {}): TokenStorage & { data: Map<string, string> } {
  const data = new Map(Object.entries(initial));
  return {
    data,
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => void data.set(key, value),
    removeItem: (key) => void data.delete(key),
  };
}

const admin: Account = { id: "a1", fullName: "Admin Test", email: "admin@example.test", role: "admin" };
const statusOf = (error: unknown) => (typeof error === "object" && error && "status" in error ? Number((error as { status: number }).status) : null);

test("reload with a valid token restores the account returned by the server", async () => {
  const storage = memoryStorage({ [SESSION_TOKEN_KEY]: "token-1" });
  let sentToken = "";
  const result = await restoreSession({
    storage,
    statusOf,
    fetchMe: async (token) => {
      sentToken = token;
      return admin;
    },
  });
  assert.equal(sentToken, "token-1");
  assert.deepEqual(result, { status: "authenticated", token: "token-1", account: admin });
  assert.equal(storage.data.get(SESSION_TOKEN_KEY), "token-1");
});

test("no stored token means anonymous and the server is never called", async () => {
  let calls = 0;
  const result = await restoreSession({ storage: memoryStorage(), statusOf, fetchMe: async () => (calls++, admin) });
  assert.deepEqual(result, { status: "anonymous", reason: "no-token" });
  assert.equal(calls, 0);
});

test("an invalid or expired token (401) is discarded and the user must sign in again", async () => {
  const storage = memoryStorage({ [SESSION_TOKEN_KEY]: "stale" });
  const result = await restoreSession({ storage, statusOf, fetchMe: async () => Promise.reject({ status: 401 }) });
  assert.deepEqual(result, { status: "anonymous", reason: "expired" });
  assert.equal(storage.data.has(SESSION_TOKEN_KEY), false);
});

test("a locked, rejected or pending account (403) is signed out on reload", async () => {
  const storage = memoryStorage({ [SESSION_TOKEN_KEY]: "token-2" });
  const result = await restoreSession({ storage, statusOf, fetchMe: async () => Promise.reject({ status: 403 }) });
  assert.deepEqual(result, { status: "anonymous", reason: "inactive" });
  assert.equal(storage.data.has(SESSION_TOKEN_KEY), false);
});

test("a role changed on the server wins over anything the browser remembers", async () => {
  const storage = memoryStorage({ [SESSION_TOKEN_KEY]: "token-3" });
  const demoted: Account = { ...admin, role: "sale" };
  const result = await restoreSession({ storage, statusOf, fetchMe: async () => demoted });
  assert.equal(result.status, "authenticated");
  if (result.status !== "authenticated") return;
  assert.equal(result.account.role, "sale");
  // The URL hash may still say #audit, but a sale account can never open an admin view.
  assert.equal(resolveView("#audit", result.account.role), "home");
  assert.equal(resolveView("#permissions", result.account.role), "home");
});

test("server or network failures keep the token and do not claim the user is signed out", async () => {
  for (const failure of [{ status: 503 }, { status: 500 }, new Error("Network Error")]) {
    const storage = memoryStorage({ [SESSION_TOKEN_KEY]: "token-4" });
    const result = await restoreSession({ storage, statusOf, fetchMe: async () => Promise.reject(failure) });
    assert.deepEqual(result, { status: "unavailable" });
    assert.equal(storage.data.get(SESSION_TOKEN_KEY), "token-4");
  }
});

test("only the opaque token is ever written; role and account data are not stored", async () => {
  const storage = memoryStorage();
  writeToken(storage, "token-5");
  await restoreSession({ storage, statusOf, fetchMe: async () => admin });
  assert.deepEqual([...storage.data.keys()], [SESSION_TOKEN_KEY]);
  assert.equal([...storage.data.values()].some((value) => /admin|role/i.test(value)), false);
});

test("an unavailable storage degrades to anonymous instead of throwing", async () => {
  const broken: TokenStorage = {
    getItem: () => {
      throw new Error("blocked");
    },
    setItem: () => {
      throw new Error("blocked");
    },
    removeItem: () => {
      throw new Error("blocked");
    },
  };
  assert.equal(readToken(broken), null);
  assert.doesNotThrow(() => writeToken(broken, "x"));
  assert.deepEqual(await restoreSession({ storage: broken, statusOf, fetchMe: async () => admin }), { status: "anonymous", reason: "no-token" });
});

test("resolveView returns the saved screen only when the confirmed role may open it", () => {
  assert.equal(resolveView("#accounts", "admin"), "accounts");
  assert.equal(resolveView("#audit", "admin"), "audit");
  assert.equal(resolveView("#companies", "sale"), "home");
  assert.equal(resolveView("#companies", "admin"), "companies");
  assert.equal(resolveView("#accounts", "sale"), "home");
  assert.equal(resolveView("#accounts", null), "home");
  assert.equal(resolveView("#worker-new", "sale"), "worker-new");
  assert.equal(resolveView("#worker-new", "nvvp"), "worker-new");
  assert.equal(resolveView("#worker-new", "admin"), "worker-new");
  assert.equal(resolveView("#worker-new", "user"), "home");
  assert.equal(resolveView("#worker-new", null), "home");
  assert.equal(resolveView("#bogus", "admin"), "dashboard");
  assert.equal(resolveView("", "admin"), "dashboard");
  assert.equal(resolveView("", "nvvp"), "home");
});
