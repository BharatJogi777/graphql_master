import test from "node:test";
import assert from "node:assert/strict";
import { execute } from "../src/lab.js";

test("union results require type-specific inline fragments", async () => {
  const result = await execute(`{ search { __typename ... on User { name } ... on Post { title } } }`);
  assert.deepEqual(result.data, { search: [
    { __typename: "User", name: "Asha" },
    { __typename: "Post", title: "GraphQL types" }
  ] });
});

test("interface exposes fields shared by implementing types", async () => {
  const result = await execute(`{ node(id: "u-1") { id __typename } }`);
  assert.deepEqual(result.data, { node: { id: "u-1", __typename: "User" } });
});

test("custom DateTime scalar serializes dates as ISO strings", async () => {
  const result = await execute(`{ search { ... on User { createdAt } } }`);
  assert.deepEqual(result.data, { search: [{ createdAt: "2026-01-01T00:00:00.000Z" }, {}] });
});
