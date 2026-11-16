import { buildSchema, subscribe, parse, type ExecutionResult } from "graphql";
import { PubSub } from "./pubsub.js";

export type CommentEvent = { commentAdded: { id: string; postId: string; body: string } };
export const pubsub = new PubSub<CommentEvent>();
const schema = buildSchema(`
  type Comment { id: ID!, postId: ID!, body: String! }
  type Query { health: String! }
  type Subscription { commentAdded(postId: ID!): Comment! }
`);
const subscriptionField = schema.getSubscriptionType()!.getFields().commentAdded;
subscriptionField.subscribe = ({ postId }: { postId: string }) => {
  let queue: CommentEvent[] = [];
  let waiting: Array<(result: IteratorResult<CommentEvent>) => void> = [];
  let closed = false;
  const unsubscribe = pubsub.subscribe("COMMENT_ADDED", (event) => {
    if (event.commentAdded.postId !== postId) return;
    const resolve = waiting.shift();
    if (resolve) resolve({ value: event, done: false });
    else queue.push(event);
  });
  const iterator: AsyncIterator<CommentEvent> = {
    next: () => {
      if (queue.length) return Promise.resolve({ value: queue.shift()!, done: false });
      if (closed) return Promise.resolve({ value: undefined, done: true });
      return new Promise((resolve) => waiting.push(resolve));
    },
    return: async () => {
      closed = true;
      unsubscribe();
      for (const resolve of waiting.splice(0)) resolve({ value: undefined, done: true });
      return { value: undefined, done: true };
    }
  };
  return { [Symbol.asyncIterator]: () => iterator };
};
subscriptionField.resolve = (event: CommentEvent) => event.commentAdded;

const rootValue = { health: () => "ok" };
export async function createCommentSubscription(postId: string) {
  return subscribe({ schema, document: parse("subscription($postId: ID!) { commentAdded(postId: $postId) { id postId body } }"), rootValue, variableValues: { postId } });
}
export function publishComment(comment: CommentEvent["commentAdded"]) {
  pubsub.publish("COMMENT_ADDED", { commentAdded: comment });
}
if (process.argv[1]?.endsWith("/lab.ts")) {
  const iterator = await createCommentSubscription("post-1") as AsyncIterableIterator<ExecutionResult>;
  publishComment({ id: "c-1", postId: "post-1", body: "First comment" });
  console.log(JSON.stringify(await iterator.next(), null, 2));
  await iterator.return?.();
}
