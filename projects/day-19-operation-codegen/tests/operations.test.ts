import test from "node:test";
import assert from "node:assert/strict";
import { buildSchema, parse, validate } from "graphql";
import { readFileSync } from "node:fs";

const schema = buildSchema(readFileSync(new URL("../schema.graphql", import.meta.url), "utf8"));
const operations = readFileSync(new URL("../src/products.graphql", import.meta.url), "utf8");

test("all client operations validate against the checked-in schema", () => {
  const errors = validate(schema, parse(operations));
  assert.deepEqual(errors, []);
});

test("operation document contains named operations for generated types", () => {
  const document = parse(operations);
  const names = document.definitions
    .filter((definition) => definition.kind === "OperationDefinition")
    .map((definition) => definition.name?.value);
  assert.deepEqual(names, ["Products", "ProductById"]);
});
