import test from 'node:test';
import assert from 'node:assert/strict';
import { createContext, resolvers } from '../src/schema.js';
import { metrics, resetMetrics } from '../src/data.js';

test('batches several post author lookups into one batch query', async () => {
  resetMetrics();
  const context = createContext();
  const posts = [
    { id: 'p1', authorId: 'u1', title: 'one' },
    { id: 'p2', authorId: 'u2', title: 'two' },
    { id: 'p3', authorId: 'u1', title: 'three' },
    { id: 'p4', authorId: 'u3', title: 'four' },
  ];

  const authors = await Promise.all(
    posts.map((post) => resolvers.Post.author(post, {}, context)),
  );

  assert.deepEqual(authors.map((author) => author?.id), ['u1', 'u2', 'u1', 'u3']);
  assert.equal(metrics.userLookupCalls, 1);
  assert.equal(metrics.userRowsRead, 3);
});

test('memoizes repeated keys within one request', async () => {
  resetMetrics();
  const context = createContext();
  const first = await context.userById.load('u1');
  const second = await context.userById.load('u1');
  assert.equal(first?.id, second?.id);
  assert.equal(metrics.userLookupCalls, 1);
});
