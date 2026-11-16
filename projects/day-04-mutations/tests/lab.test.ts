import test from "node:test";
import assert from "node:assert/strict";
import { execute, resetStore } from "../src/lab.js";

test("createProduct accepts an input object and applies enum default", async () => {
  resetStore();
  const result = await execute(`mutation Create($input: CreateProductInput!) { createProduct(input: $input) { id name status } }`, { input: { name: "Desk", priceMinor: 12999 } });
  assert.deepEqual(result.data, { createProduct: { id: "p-2", name: "Desk", status: "DRAFT" } });
});

test("nullable optional input field can be omitted", async () => {
  resetStore();
  const result = await execute(`mutation { createProduct(input: { name: "Dock", priceMinor: 5000, status: ACTIVE }) { description status } }`);
  assert.deepEqual(result.data, { createProduct: { description: null, status: "ACTIVE" } });
});

test("archive mutation changes stored state", async () => {
  resetStore();
  const result = await execute(`mutation { archiveProduct(id: "p-1") { id status } }`);
  assert.deepEqual(result.data, { archiveProduct: { id: "p-1", status: "ARCHIVED" } });
});

test("invalid enum input is rejected before mutation executes", async () => {
  resetStore();
  const result = await execute(`mutation { createProduct(input: { name: "Bad", priceMinor: 1, status: BROKEN }) { id } }`);
  assert.ok(result.errors?.some((error) => error.message.includes("BROKEN")));
});
