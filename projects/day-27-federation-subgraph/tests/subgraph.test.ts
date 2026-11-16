import test from "node:test";
import assert from "node:assert/strict";
import { graphql } from "graphql";
import { schema } from "../src/subgraph.js";

test("subgraph resolves its locally owned product fields", async () => {
  const result = await graphql({ schema, source: '{ product(id:"p-1") { id sku name } }' });
  assert.deepEqual(result.data, { product: { id: "p-1", sku: "KB-1", name: "Keyboard" } });
});

test("subgraph exposes federation entity metadata", () => {
  assert.ok(schema.getType("_Entity"));
  assert.ok(schema.getType("_Service"));
  assert.ok(schema.getQueryType()?.getFields()._entities);
});

test("entity reference resolves by key", async () => {
  const result = await graphql({
    schema,
    source: 'query($representations: [_Any!]!) { _entities(representations: $representations) { ... on Product { id name } } }',
    variableValues: { representations: [{ __typename: "Product", id: "p-2" }] }
  });
  assert.deepEqual(result.data, { _entities: [{ id: "p-2", name: "USB Hub" }] });
});
