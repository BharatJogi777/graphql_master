import test from "node:test";
import assert from "node:assert/strict";
import { execute } from "../src/lab.js";

test("variables pass runtime values separately from the query document", async () => {
  const result = await execute(`query($id: ID!) { user(id: $id) { name } }`, { id: "u-2" });
  assert.deepEqual(result.data, { user: { name: "Ravi" } });
});

test("aliases rename response keys without changing schema fields", async () => {
  const result = await execute(`{ primary: user(id: "u-1") { name } secondary: user(id: "u-2") { name } }`);
  assert.deepEqual(result.data, { primary: { name: "Asha" }, secondary: { name: "Ravi" } });
});

test("fragments reuse a selection set", async () => {
  const result = await execute(`query { users { ...Summary } } fragment Summary on User { id name }`);
  assert.deepEqual(result.data, { users: [{ id: "u-1", name: "Asha" }, { id: "u-2", name: "Ravi" }] });
});

test("multiple root fields are returned in one response", async () => {
  const result = await execute(`{ users { id } post(id: "post-2") { title } }`);
  assert.deepEqual(result.data, { users: [{ id: "u-1" }, { id: "u-2" }], post: { title: "Resolver execution" } });
});

test("operationName selects one operation in a multi-operation document", async () => {
  const result = await execute(`query First { user(id: "u-1") { name } } query Second { user(id: "u-2") { name } }`, undefined, "Second");
  assert.deepEqual(result.data, { user: { name: "Ravi" } });
});
