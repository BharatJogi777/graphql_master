import test from "node:test";
import assert from "node:assert/strict";
import { createCommentSubscription, publishComment, pubsub } from "../src/lab.js";

test("subscription receives matching published event", async () => {
  const iterator = await createCommentSubscription("post-1") as AsyncIterableIterator<any>;
  publishComment({ id: "c-1", postId: "post-1", body: "Hello" });
  const result = await iterator.next();
  assert.deepEqual(result.value.data, { commentAdded: { id: "c-1", postId: "post-1", body: "Hello" } });
  await iterator.return?.();
});

test("subscription filters events by post ID", async () => {
  const iterator = await createCommentSubscription("post-2") as AsyncIterableIterator<any>;
  publishComment({ id: "c-2", postId: "post-1", body: "Wrong post" });
  publishComment({ id: "c-3", postId: "post-2", body: "Right post" });
  const result = await iterator.next();
  assert.equal(result.value.data.commentAdded.id, "c-3");
  await iterator.return?.();
});

test("return closes iterator and removes listener", async () => {
  const before = pubsub.listenerCount("COMMENT_ADDED");
  const iterator = await createCommentSubscription("post-3") as AsyncIterableIterator<any>;
  assert.equal(pubsub.listenerCount("COMMENT_ADDED"), before + 1);
  await iterator.return?.();
  assert.equal(pubsub.listenerCount("COMMENT_ADDED"), before);
});
