import test from "node:test";
import assert from "node:assert/strict";
import { ProductCache, cache, execute, metrics, reset } from "../src/lab.js";

test("cache returns a stored value until TTL expires", () => {
  let now = 100;
  const local = new ProductCache(50, () => now);
  local.set("x", { id: "x", name: "X", priceMinor: 10, updatedAt: 1 });
  assert.equal(local.get("x")?.name, "X");
  now = 151;
  assert.equal(local.get("x"), undefined);
});

test("repeated product lookup avoids a second repository read", async () => {
  reset();
  await execute('{ product(id:"p-1") { id } }');
  await execute('{ product(id:"p-1") { name } }');
  assert.equal(metrics.databaseReads, 1);
});

test("mutation invalidates cached product data", async () => {
  reset();
  await execute('{ product(id:"p-1") { name } }');
  await execute('mutation { renameProduct(id:"p-1", name:"New Keyboard") { name } }');
  const result = await execute('{ product(id:"p-1") { name } }');
  assert.deepEqual(result.data, { product: { name: "New Keyboard" } });
  assert.equal(metrics.databaseReads, 2);
});

test("cache supports explicit invalidation", () => {
  cache.set("manual", null);
  assert.equal(cache.get("manual"), null);
  cache.invalidate("manual");
  assert.equal(cache.get("manual"), undefined);
});
