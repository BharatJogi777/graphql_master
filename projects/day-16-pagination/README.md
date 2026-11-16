# Day 16 — Offset and Cursor Pagination

## Goal
Compare offset pagination with Relay-style cursor connections and understand stable ordering.

## Run
```bash
npm install
npm test
npm run typecheck
npm run
```

## Study
- Offset pagination is simple and useful for shallow pages, but large offsets can be expensive and inserts can shift page boundaries.
- Cursor pagination continues from a stable ordering key and is generally better for feeds.
- A connection contains edges, cursors and pageInfo.
- Cursors should be opaque to clients and validated on input.
- Always define deterministic ordering with a unique tie-breaker.

## Practice
1. Add backward pagination with `last` and `before`.
2. Replace the in-memory array with a SQL query using `WHERE (created_at, id) < (...)`.
3. Add a composite index matching the order/filter predicates.
4. Test duplicate timestamps and concurrent inserts.
5. Add filters and ensure the cursor is bound to the same filter/sort context.

## Production note
This lab uses an encoded ID cursor over a static dataset. A production cursor should represent the actual ordered position, include a unique tie-breaker, and be validated against filter/sort parameters. Do not use unbounded `first` values.
