import test from "node:test";
import assert from "node:assert/strict";
import { decodeCursor, encodeCursor, execute } from "../src/lab.js";

test("offset pagination returns requested slice and metadata", async () => {
  const result = await execute("{ postsOffset(page: 2, pageSize: 5) { items { id } page totalCount totalPages } }");
  assert.deepEqual(result.data, {
    postsOffset: {
      items: [{ id: "19" }, { id: "18" }, { id: "17" }, { id: "16" }, { id: "15" }],
      page: 2, totalCount: 23, totalPages: 5
    }
  });
});

test("cursor pagination returns stable cursor edges and next page", async () => {
  const first = await execute("{ posts(first: 3) { edges { cursor node { id } } pageInfo { hasNextPage endCursor } } }");
  const page = first.data?.posts as { edges: Array<{ node: { id: string } }>; pageInfo: { endCursor: string } };
  assert.deepEqual(page.edges.map((edge) => edge.node.id), ["23", "22", "21"]);
  const after = (first.data?.posts as { pageInfo: { endCursor: string } }).pageInfo.endCursor;
  const second = await execute("query($after: String!) { posts(first: 3, after: $after) { edges { node { id } } pageInfo { hasPreviousPage } } }", { after });
  assert.deepEqual((second.data?.posts as { edges: Array<{ node: { id: string } }> }).edges.map((edge) => edge.node.id), ["20", "19", "18"]);
});

test("cursor codec rejects malformed values", () => {
  assert.equal(decodeCursor(encodeCursor("42")), "42");
  assert.throws(() => decodeCursor("not-a-valid-cursor!"), /Invalid pagination cursor/);
});

test("page size is bounded", async () => {
  const result = await execute("{ posts(first: 100) { totalCount } }");
  assert.ok(result.errors?.length);
});
