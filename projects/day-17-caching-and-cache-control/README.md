# Day 17 — Resolver Caching and Cache Invalidation

## Goal
Understand resolver-level caching, TTL expiry and mutation-driven invalidation.

## Run
```bash
npm install
npm test
npm run typecheck
npm run
```

## Study
- A cache hit must be distinguishable from a cached null/missing result.
- TTL bounds staleness but does not by itself guarantee consistency.
- Mutations should invalidate or update affected cache entries.
- Request-scoped memoization (DataLoader) and shared cross-request caches solve different problems.
- Cache keys must include tenant, authorization scope, locale and filters whenever they affect the result.

## Practice
1. Add a tenant ID to the cache key and write a cross-tenant isolation test.
2. Add a bounded LRU policy so the map cannot grow forever.
3. Add cache hit/miss/eviction metrics.
4. Add a version field to prevent stale writes overwriting newer cache entries.
5. Compare Redis cache-aside with in-process caching.

## Production note
This in-memory cache is educational and single-process only. A production distributed cache needs bounded memory, TTLs, invalidation strategy, observability, tenant-aware keys and a clear consistency model. Do not cache authorization-sensitive data under a user-agnostic key.
