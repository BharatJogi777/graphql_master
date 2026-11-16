import test from "node:test";
import assert from "node:assert/strict";
import { execute, type Principal } from "../src/lab.js";

const tenantAUser: Principal = { id: "u-1", role: "USER", tenantId: "tenant-a" };
const tenantBUser: Principal = { id: "u-2", role: "USER", tenantId: "tenant-b" };
const admin: Principal = { id: "root", role: "ADMIN", tenantId: "tenant-root" };

test("tenant list never returns another tenant's rows", async () => {
  const result = await execute("{ projects { id name } }", tenantAUser);
  assert.deepEqual(result.data, { projects: [{ id: "pr-1", name: "A Project" }] });
});

test("owner can read own project including protected secret field", async () => {
  const result = await execute('{ project(id: "pr-1") { name secret } }', tenantAUser);
  assert.deepEqual(result.data, { project: { name: "A Project", secret: "alpha-secret" } });
});

test("cross-tenant object access is hidden as not found", async () => {
  const result = await execute('{ project(id: "pr-2") { id name } }', tenantAUser);
  assert.deepEqual(result.data, { project: null });
});

test("admin can access across tenants", async () => {
  const result = await execute('{ project(id: "pr-2") { id name } }', admin);
  assert.deepEqual(result.data, { project: { id: "pr-2", name: "B Project" } });
});

test("anonymous request is rejected", async () => {
  const result = await execute("{ projects { id } }", null);
  assert.equal(result.errors?.[0]?.extensions.code, "UNAUTHENTICATED");
});
