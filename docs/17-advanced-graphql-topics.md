# 17 — Advanced GraphQL Topics and Production Gaps

This guide supplements the 30-day path. GraphQL is an evolving ecosystem, so no finite checklist can promise coverage of every implementation or vendor feature. Study these topics when they fit the product you build.

## 1. GraphQL over HTTP
- GET for safe query operations where supported; POST for queries and mutations.
- Understand content negotiation, status codes, request media types and response media types.
- Test malformed JSON, malformed documents, validation failures, execution errors and unsupported methods.
- Review the GraphQL-over-HTTP specification separately from the core GraphQL language specification.

## 2. Directives and schema metadata
- Built-in @skip and @include.
- @deprecated and deprecation reason.
- Custom schema directives versus executable directives.
- Directive locations, validation and implementation-specific behavior.
- Use directives for cross-cutting metadata only when they improve clarity; do not hide business authorization in client-controlled directives.

## 3. Incremental delivery
- Understand @defer and @stream concepts, incremental payloads and client support.
- Confirm server, transport and client compatibility before adopting.
- Handle partial rendering, cancellation, errors and observability.
- Treat implementation support as version/vendor-specific; verify current specification status.

## 4. Uploads and downloads
- GraphQL core does not define a universal file upload protocol.
- Prefer direct-to-object-storage uploads using short-lived signed URLs for large files.
- If using multipart upload conventions, document the non-core protocol, enforce size/type limits, scan files and authorize both upload and download.
- Avoid buffering unbounded files in application memory.

## 5. Persisted and trusted operations
- Distinguish automatic persisted queries (APQ) from an allowlist/trusted-document policy.
- APQ is primarily a transport/cache optimization; it is not by itself an authorization or query-safety boundary.
- Build an operation registration/review pipeline, version operation manifests and define behavior for unknown hashes.
- Measure adoption and preserve rollback capability.

## 6. Schema governance
- Schema registry, schema checks and client compatibility.
- Breaking-change detection and deprecation windows.
- Ownership, review rules and release coordination.
- Contract checks against real client operations.
- Keep registry/router features distinct from GraphQL language features.

## 7. Federation in depth
- Subgraph ownership, entity keys, reference resolution and composition.
- Query planning, router-to-subgraph traffic and failure propagation.
- Entity authorization and tenant context across subgraphs.
- Schema composition checks, rollout/rollback and router observability.
- Compare a modular monolith, a GraphQL gateway/BFF and Federation before choosing.

## 8. Real-time alternatives and reliability
- WebSocket subscriptions, Server-Sent Events, polling and webhooks.
- Connection authentication, re-authentication, authorization on every event, backpressure and fan-out.
- Reconnect, duplicate delivery, ordering, replay and missed-event recovery.
- Define delivery semantics explicitly; do not promise exactly-once delivery without a complete system design.

## 9. Advanced performance controls
- Cost analysis based on arguments and list multipliers, not only query depth.
- Per-operation budgets, concurrency limits, timeouts and cancellation.
- Cache partitioning by identity/tenant and invalidation after mutations.
- Database query plans, pool saturation and downstream fan-out.
- Load tests with realistic selection sets and worst-case cardinalities.

## 10. When to use GraphQL
GraphQL is not automatically better than REST. Consider REST, gRPC, events, webhooks or a hybrid when they fit the consumer and operational requirements better. Evaluate caching, observability, client diversity, team ownership, payload needs and complexity.

## Study rule
For each advanced feature, record: problem solved, alternatives, specification status, chosen implementation/version, security implications, operational failure modes, tests and rollback plan.
