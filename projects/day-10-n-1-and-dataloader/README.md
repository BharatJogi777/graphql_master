# Day 10 — N+1 and DataLoader

This is a standalone, runnable GraphQL lab. It intentionally starts with an in-memory data source so you can isolate resolver execution and batching before introducing Prisma in the capstone.

## Learning objectives

- Reproduce the N+1 resolver pattern.
- Understand why GraphQL executes nested resolvers independently.
- Batch keys with DataLoader.
- Preserve result order when database rows return in a different order.
- Understand per-request caching and why a loader must not be global.

## Run

Requirements: Node.js 20+.

```bash
npm install
npm run dev
```

Open the printed URL (normally `http://localhost:4000/`).

First execute the posts query:

```graphql
query {
  posts {
    id
    title
    author { id name }
  }
}
```

Then execute the metrics query separately:

```graphql
query {
  metrics {
    userLookupCalls
    userRowsRead
  }
}
```

Expected metrics for five posts and three distinct authors:

- `userLookupCalls`: 1
- `userRowsRead`: 3

The naive implementation would look up the author separately for each post (up to five calls). DataLoader batches the author IDs and deduplicates repeated keys inside one request. Metrics are queried separately because GraphQL may execute sibling root fields concurrently.

## Automated tests

```bash
npm test
npm run typecheck
```

## Exercises

1. Replace the DataLoader call in `src/schema.ts` with `users.find(user => user.id === post.authorId)`. Explain the database-call pattern this represents.
2. Add a `postsByAuthorId` loader and a `User.posts` field.
3. Write a test proving that the batch function returns values in the same order as requested IDs even when the source returns rows in a different order.
4. Create two contexts and prove that their caches are independent.
5. Explain why a process-global DataLoader is unsafe in a multi-tenant API.

## Production connection

See `../../capstone/src/loaders` for Prisma-backed, tenant-scoped request loaders and nested order resolvers. The capstone keeps loader instances inside the GraphQL request context.
