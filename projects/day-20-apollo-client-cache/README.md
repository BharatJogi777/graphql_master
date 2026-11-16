# Day 20 — Apollo Client Normalized Cache

## Goal
Understand normalized entity identity, field policies, cache keys and pagination merging.

## Run
```bash
npm install
npm test
npm run typecheck
```

## Study
- Apollo normalizes objects by cache identity (typically `__typename:id`).
- Different query results can point to the same normalized entity.
- `keyArgs` determines which field arguments create separate cached result sets.
- Merge policies combine pages; incorrect keys can mix tenant or filter results.
- Cache updates after mutations must keep UI data consistent with server state.

## Practice
1. Add a mutation update that writes the returned Product into the normalized cache.
2. Add cursor-based pagination with a merge function that deduplicates edges by cursor.
3. Add tenant/account context to cache lifecycle and clear cache on account switch.
4. Test optimistic updates and rollback on mutation failure.
5. Add cache eviction for deleted products.

## Production note
Never reuse a client cache across authenticated users without a deliberate isolation strategy. Clear or recreate the cache when identity/tenant changes. Ensure pagination merge logic respects filters and sorting.
