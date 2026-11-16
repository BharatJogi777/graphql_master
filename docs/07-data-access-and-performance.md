
# 07 — Data Access, DataLoader and Performance

## N+1 problem
If a query loads 50 orders and each Order.customer resolver independently queries a customer, one orders query plus 50 customer queries occurs. Reproduce it first: log SQL/query count and latency.

## DataLoader
DataLoader batches keys requested during one execution window and memoizes results for its lifetime. The batch function must return results in the same order as input keys, including placeholders for missing records.

~~~~ts
const customerLoader = new DataLoader(async (ids: readonly string[]) => {
  const rows = await repository.findByIds([...ids]);
  const byId = new Map(rows.map(row => [row.id, row]));
  return ids.map(id => byId.get(id) ?? null);
});
~~~~

Create loaders per request when data depends on identity/tenant or request consistency. A global loader can leak data across users or serve stale data. Define cache behavior and mutation invalidation.

## Efficient data access
- Use joins or batched IN queries for relations.
- Select only needed columns where appropriate.
- Add indexes based on real filters/orderings; inspect query plans.
- Avoid one DB call per nested field.
- Bound list sizes and relation traversal.
- Use transactions for invariants spanning writes.
- Do not use fragile selection-set parsing as a substitute for sound data-access design.

## Pagination
Offset is simple but may become expensive/unstable under inserts/deletes. Cursor pagination uses a stable ordering key and a cursor representing position. Include a unique tie-breaker (createdAt + id), validate cursor and cap page size.

Relay-style shape:
~~~~graphql
type OrderEdge { cursor: String!, node: Order! }
type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}
type OrderConnection {
  edges: [OrderEdge!]!
  pageInfo: PageInfo!
}
~~~~

## Caching
Request DataLoader memoization, shared application cache, client normalized cache and HTTP/CDN caching have different scopes. Cache invalidation and auth partitioning matter. GraphQL POST responses are not automatically CDN-cacheable; persisted GET operations and explicit cache policies can help, but private data needs careful partitioning.

## Exercises
1. Measure query count for 50 orders + customer.
2. Implement DataLoader; verify bounded query count.
3. Test missing IDs and output ordering.
4. Prove request-scoped loaders do not leak tenant/user data.
5. Compare offset/cursor pagination during concurrent inserts.
6. Add an index and compare EXPLAIN ANALYZE.
7. Add cache and test invalidation after product update.
8. Enforce maximum page size.

Acceptance: submit before/after query counts, timings, SQL plan and correctness trade-offs.
