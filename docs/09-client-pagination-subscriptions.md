
# 09 — Client, Pagination and Subscriptions

## Client fundamentals
A GraphQL client sends operation documents and variables, handles data/errors and may maintain a normalized cache. Understand the wire request before adopting a library. Name operations, type variables and generate TypeScript types where useful. Generated types do not replace runtime validation or server authorization.

## Normalized cache
A normalized cache stores entities by identity and fields separately, so the same entity can be shared across operations. Understand cache keys, embedded objects, list membership and invalidation. After mutation, update affected entities/lists, refetch or use an optimistic result deliberately.

## Optimistic updates
Optimistic UI predicts a likely result before the server responds. Define rollback on failure. Avoid unsafe assumptions for payments or inventory allocation; server remains authoritative.

## Cursor pagination
For forward pagination, clients pass first and after; server returns edges and pageInfo. Preserve ordering, use opaque cursors, cap page size and test duplicates/missing records under concurrent changes. Support last/before only if deliberately implemented and documented.

## Subscriptions
Subscriptions deliver events over a long-lived transport, commonly WebSocket. The GraphQL spec defines subscription execution; transport and broker are implementation choices. Production design requires:
- Authentication at connection and/or operation time; expiry/revocation strategy.
- Per-event authorization when permissions can change.
- Pub/sub for multiple replicas.
- Backpressure, connection quotas and message-size limits.
- Reconnect/resubscribe behavior.
- Duplicate/out-of-order event handling and event IDs.
- Graceful shutdown and cleanup.
- Metrics for active connections, delivery latency and failures.

An in-memory event emitter is acceptable for a single-process local exercise, not a multi-replica production broker.

## Alternatives and exercises
Polling, webhooks, SSE or a dedicated event stream may be simpler. Choose based on latency, directionality, reliability and cost.

Exercises: generate typed operations; inspect cache identity; update product cache after mutation; implement optimistic rollback; implement authorized order-status subscription; simulate reconnect/duplicate/restart; document when polling is better.

Acceptance: client cache behavior is predictable, pagination is stable and subscription security/reliability is understood.
