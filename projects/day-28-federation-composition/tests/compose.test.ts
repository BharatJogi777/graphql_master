import test from "node:test";
import assert from "node:assert/strict";
import { compose } from "../src/compose.js";

test("valid subgraphs compose into a supergraph schema", () => {
  const result = compose();
  assert.ok(result.supergraphSdl);
  assert.equal(result.errors?.length ?? 0, 0);
});

test("supergraph includes entity and subgraph routing metadata", () => {
  const result = compose();
  assert.match(result.supergraphSdl ?? "", /join__Graph/);
  assert.match(result.supergraphSdl ?? "", /Product/);
});

test("valid entity ownership has no composition errors", () => {
  const result = compose();
  assert.equal(result.errors?.length ?? 0, 0);
});
