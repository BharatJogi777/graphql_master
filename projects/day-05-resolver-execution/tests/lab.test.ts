import test from "node:test";
import assert from "node:assert/strict";
import { execute, resolverTrace, resetTrace } from "../src/lab.js";

test("nested fields resolve from the parent value", async () => {
  resetTrace();
  const result = await execute(`{ user(id: "u-1") { name posts { title author { name } } } }`);
  assert.deepEqual(result.data, {
    user: { name: "Asha", posts: [
      { title: "GraphQL basics", author: { name: "Asha" } },
      { title: "Resolver tree", author: { name: "Asha" } }
    ] }
  });
});

test("resolver trace shows the execution path", async () => {
  resetTrace();
  await execute(`{ users { posts { author { name } } } }`);
  assert.ok(resolverTrace.includes("Query.users"));
  assert.ok(resolverTrace.includes("User.posts:u-1"));
  assert.ok(resolverTrace.includes("Post.author:post-1"));
});

test("unselected fields are not part of the response", async () => {
  const result = await execute(`{ users { id } }`);
  assert.deepEqual(result.data, { users: [{ id: "u-1" }, { id: "u-2" }] });
});
