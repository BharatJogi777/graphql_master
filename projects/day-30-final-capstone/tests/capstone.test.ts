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
