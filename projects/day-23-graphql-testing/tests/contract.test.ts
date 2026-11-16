import test from "node:test";
import assert from "node:assert/strict";
import { execute, reset } from "../src/app.js";

test("catalog contract returns only requested fields", async () => {
  const result = await execute("{ products { id name } }");
  assert.deepEqual(result.data, { products: [{ id: "p-1", name: "Keyboard" }, { id: "p-2", name: "USB Hub" }] });
});

test("query variables are accepted and missing product is nullable", async () => {
  const result = await execute("query($id: ID!) { product(id: $id) { id name } }", { id: "missing" });
  assert.deepEqual(result.data, { product: null });
});

test("mutation changes subsequent query result", async () => {
  reset();
  const mutation = await execute('mutation { renameProduct(id:"p-1", name:"Ergonomic Keyboard") { id name } }');
  assert.deepEqual(mutation.data, { renameProduct: { id: "p-1", name: "Ergonomic Keyboard" } });
  const query = await execute('{ product(id:"p-1") { name } }');
  assert.deepEqual(query.data, { product: { name: "Ergonomic Keyboard" } });
  reset();
});

test("invalid operations fail schema validation", async () => {
  const result = await execute("{ products { internalPassword } }");
  assert.ok(result.errors?.some((error) => error.message.includes("internalPassword")));
});

test("required variables fail before resolver execution", async () => {
  const result = await execute("query($id: ID!) { product(id: $id) { id } }");
  assert.ok(result.errors?.length);
});
