import test from "node:test";
import assert from "node:assert/strict";
import { parseDocument, validateDocument, runDocument, domainError } from "../src/lab.js";

test("syntax errors are parse errors", () => {
  const result = parseDocument("{ products { id ");
  assert.equal(result.document, null);
  assert.ok(result.errors.length > 0);
});

test("unknown fields are rejected by schema validation", () => {
  const errors = validateDocument("{ products { missingField } }");
  assert.ok(errors.some((error) => error.message.includes("missingField")));
});

test("wrong argument type is rejected during validation", () => {
  const errors = validateDocument("{ product(id: 123) { id } }");
  assert.ok(errors.length > 0);
});

test("missing required variable is rejected during variable coercion", async () => {
  const result = await runDocument("query($id: ID!) { product(id: $id) { id } }");
  assert.ok(result.errors?.some((error) => error.message.includes("was not provided")));
});

test("valid operation executes after parse and validation", async () => {
  const result = await runDocument("{ product(id: \"p-1\") { name } }");
  assert.deepEqual(result.data, { product: { name: "Keyboard" } });
});

test("domain errors expose a stable machine-readable code", () => {
  const error = domainError("Product does not exist");
  assert.equal(error.extensions.code, "PRODUCT_NOT_FOUND");
});
