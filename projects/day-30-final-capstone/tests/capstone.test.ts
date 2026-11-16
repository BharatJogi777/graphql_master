import test from "node:test";
import assert from "node:assert/strict";
import { execute, reset } from "../src/server.js";

test("health query executes", async () => {
  const result = await execute("{ health }");
  assert.deepEqual(result.data, { health: "ok" });
});

test("creates product and returns stable idempotent result", async () => {
  reset();
  const source = 'mutation($input: CreateProductInput!) { createProduct(input:$input, idempotencyKey:"request-1") { id sku name priceMinor } }';
  const variables = { input: { sku: "kb-1", name: "Keyboard", priceMinor: 7999 } };
  const first = await execute(source, variables, "tenant-a");
  const retry = await execute(source, variables, "tenant-a");
  assert.deepEqual(first.data, retry.data);
});

test("reusing an idempotency key with a different payload is a conflict", async () => {
  reset();
  const source = 'mutation($input: CreateProductInput!) { createProduct(input:$input, idempotencyKey:"same-key") { id sku } }';
  await execute(source, { input: { sku: "kb-1", name: "Keyboard", priceMinor: 7999 } }, "tenant-a");
  const retry = await execute(source, { input: { sku: "mouse-1", name: "Mouse", priceMinor: 1999 } }, "tenant-a");
  assert.equal(retry.errors?.[0]?.extensions.code, "CONFLICT");
});

test("invalid cursor is rejected instead of silently restarting pagination", async () => {
  reset();
  const result = await execute('{ products(after: "missing-id") { id } }');
  assert.equal(result.errors?.[0]?.extensions.code, "BAD_USER_INPUT");
});

test("tenant scoping prevents cross-tenant product visibility", async () => {
  reset();
  await execute('mutation { createProduct(input:{sku:"x",name:"X",priceMinor:1}, idempotencyKey:"x") { id } }', undefined, "tenant-a");
  const result = await execute("{ products { id sku } }", undefined, "tenant-b");
  assert.deepEqual(result.data, { products: [] });
});

test("invalid input returns safe domain error code", async () => {
  reset();
  const result = await execute('mutation { createProduct(input:{sku:" ",name:"X",priceMinor:-1}, idempotencyKey:"bad") { id } }');
  assert.equal(result.errors?.[0]?.extensions.code, "BAD_USER_INPUT");
});

test("pagination limit is bounded", async () => {
  const result = await execute("{ products(first:100) { id } }");
  assert.equal(result.errors?.[0]?.extensions.code, "BAD_USER_INPUT");
});
