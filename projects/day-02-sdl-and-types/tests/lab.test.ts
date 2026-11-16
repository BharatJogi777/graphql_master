import test from "node:test";
import assert from "node:assert/strict";
import { execute, schemaSDL } from "../src/lab.js";

test("SDL exposes Product, enum and Query fields", () => {
  const sdl = schemaSDL();
  assert.match(sdl, /enum ProductStatus/);
  assert.match(sdl, /description: String/);
  assert.match(sdl, /product\(id: ID!\): Product/);
});

test("ID! argument resolves a product", async () => {
  const result = await execute(`query ProductById($id: ID!) { product(id: $id) { id name } }`, { id: "p-1" });
  assert.deepEqual(result.errors, undefined);
  assert.deepEqual(result.data, { product: { id: "p-1", name: "Mechanical Keyboard" } });
});

test("nullable description can be null", async () => {
  const result = await execute(`{ product(id: "p-2") { description } }`);
  assert.deepEqual(result.data, { product: { description: null } });
});

test("enum argument filters products", async () => {
  const result = await execute(`{ products(status: ACTIVE) { id } }`);
  assert.deepEqual(result.data, { products: [{ id: "p-1" }, { id: "p-3" }] });
});

test("missing required argument is rejected during validation", async () => {
  const result = await execute(`{ product { id } }`);
  assert.ok(result.errors?.some((error) => error.message.includes("id")));
});
