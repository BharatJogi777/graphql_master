import test from "node:test";
import assert from "node:assert/strict";
import { execute, reset } from "../src/lab.js";

test("valid input is normalized and stored", async () => {
  reset();
  const result = await execute(
    "mutation($input: CreateProductInput!) { createProduct(input: $input) { sku name priceMinor } }",
    { input: { sku: " kb-1 ", name: " Keyboard ", priceMinor: 7999 } }
  );
  assert.deepEqual(result.data, { createProduct: { sku: "KB-1", name: "Keyboard", priceMinor: 7999 } });
});

test("GraphQL coercion rejects wrong scalar input types", async () => {
  reset();
  const result = await execute(
    "mutation($input: CreateProductInput!) { createProduct(input: $input) { id } }",
    { input: { sku: "x", name: "X", priceMinor: "100" } }
  );
  assert.ok(result.errors?.some((error) => error.message.includes("Int")));
});

test("duplicate SKU returns stable conflict code", async () => {
  reset();
  const source = 'mutation { createProduct(input: {sku:"x", name:"X", priceMinor:100}) { id } }';
  await execute(source);
  const duplicate = await execute(source);
  assert.equal(duplicate.errors?.[0]?.extensions.code, "CONFLICT");
});

test("blank strings fail domain validation", async () => {
  reset();
  const result = await execute('mutation { createProduct(input: {sku:" ", name:"X", priceMinor:100}) { id } }');
  assert.equal(result.errors?.[0]?.extensions.code, "BAD_USER_INPUT");
});
