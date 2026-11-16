# 19 — Complete Implementation Blueprint (Days 1–30)

This is the authoritative implementation contract for the 30 labs. Each day must result in code, tests, a local run, and a short explanation. The per-day README is the task card; this file defines the end-to-end sequencing and cross-cutting requirements.

## Shared capstone domain

Build a small commerce/order platform:
- User belongs to a Tenant and has a role.
- Product has SKU, name, description, price in minor currency units, status and timestamps.
- Order belongs to a User/Tenant and contains OrderItems referencing Products.
- Order status transitions are validated domain operations.
- Search returns a union of Product and User results.
- Order status changes can publish events.

Never store money in floating-point. Use integer minor units plus currency, or a decimal database type with explicit serialization. Use UUIDs/opaque IDs where appropriate. Every tenant-owned query must scope by tenant in the data-access layer.

## Daily implementation contracts

### Day 1 — Hello and request lifecycle
Create a minimal Apollo Server, schema, resolver and execution test. Trace request receipt → parse → validate → variable coercion → execute → complete → serialize. Demonstrate a default field resolver.

### Day 2 — SDL and type system
Define Product, User, ProductStatus, ProductFilter and pagination input types. Test scalar behavior, enum rejection, list wrappers and null bubbling. Deliver a schema diagram.

### Day 3 — Query composition
Implement product(id), products(filter, first), customer(id) and search(term). Use named operations, variables, aliases and fragments. Save reusable .graphql documents and test validation.

### Day 4 — Mutations
Implement createProduct, updateProduct and archiveProduct with dedicated input objects. Validate SKU uniqueness and state transitions. Use a transaction for multi-row writes. Test duplicate, not-found and invalid-state outcomes.

### Day 5 — Resolver execution
Implement nested Product, User, Order and OrderItem fields. Keep resolvers thin: parse GraphQL arguments, call a service, return values. Demonstrate parent/args/context/info and default resolver behavior.

### Day 6 — Errors
Separate syntax, validation, variable coercion and execution failures. Return stable client-safe codes for expected domain errors; log unexpected errors with correlation IDs without exposing stack traces.

### Day 7 — NestJS
Create NestJS module boundaries, GraphQL module, resolvers, providers, config validation and e2e tests. Choose schema-first or code-first and document the choice. Confirm dependency versions are compatible.

### Day 8 — PostgreSQL and Prisma
Add PostgreSQL, Prisma schema, initial migration, seed and repository/service boundary. Verify a clean database can migrate and seed. Configure connection pool limits and shutdown.

### Day 9 — Relations and transactions
Model Tenant, User, Product, Order and OrderItem relations. Implement order creation atomically. Force a failure mid-transaction and prove rollback.

### Day 10 — N+1 and DataLoader
Measure SQL query count for nested order/customer/product fields before optimization. Add request-scoped loaders. Verify key ordering, missing values, errors, tenant scope and no cross-request cache leakage.

### Day 11 — Abstract types and scalars
Implement SearchResult union or interface and resolve runtime types. Add DateTime scalar and Money value representation. Test parseValue, parseLiteral and serialize.

### Day 12 — Schema evolution
Add a field, deprecate a legacy field and run schema/operation compatibility checks. Document a non-breaking migration sequence and client adoption window.

### Day 13 — Authentication
Verify token signature, issuer, audience and expiry at the HTTP boundary. Create a typed request context containing authenticated principal and tenant. Never trust identity/tenant IDs supplied in mutation inputs.

### Day 14 — Authorization and tenancy
Enforce role, ownership and tenant policies in services/repositories, not only in UI or root resolvers. Test guessed IDs, nested resolver paths, subscriptions, DataLoader and cache isolation.

### Day 15 — Validation and safe errors
Validate input lengths, formats, ranges and business invariants. Preserve database constraints as the final integrity boundary. Redact secrets and PII in logs and client errors.

### Day 16 — Cursor pagination
Implement deterministic keyset pagination (stable sort plus unique tie-breaker). Cap page size. Test empty page, deleted cursor row, invalid cursor and concurrent inserts.

### Day 17 — Relay connections
Expose edges, node, cursor and PageInfo. Implement first/after; implement last/before only if needed. Test hasNextPage/hasPreviousPage at all boundaries.

### Day 18 — Caching
Separate request-scoped DataLoader memoization from shared application cache and client cache. Define key partitioning, TTL, invalidation, stale behavior and outage behavior. Prove tenant isolation.

### Day 19 — Query safety
Apply request byte limits, depth and weighted complexity/cost limits, pagination caps, timeouts, concurrency limits and rate limits. Depth alone is not sufficient: account for list multipliers and nested fan-out. Reject abusive requests before database work.

### Day 20 — Client and code generation
Store operation documents and generate TypeScript types from schema plus operations. Make generation/check part of local verification. Demonstrate that a renamed/removed field fails client type checking.

### Day 21 — Client cache
Configure normalized identity, pagination merge and mutation updates. Test optimistic update rollback and stale list invalidation. Never put authorization decisions in client cache policy.

### Day 22 — Subscriptions
Publish order status events using an abstraction over a broker/pub-sub implementation. Authenticate connection and authorize each subscription. Clean up resources on disconnect.

### Day 23 — Subscription reliability
Add event IDs, bounded buffering, reconnect strategy and replay/resume where supported. Make consumers idempotent. Document ordering and at-most/at-least-once semantics; do not claim exactly-once delivery without proof.

### Day 24 — Testing
Build unit, resolver, operation, integration and end-to-end tests. Include negative authorization, tenant boundary, database failure and regression cases. Keep test fixtures deterministic.

### Day 25 — Observability
Instrument operation and resolver duration, error rates, DB query timing, DataLoader batch sizes and downstream calls. Add correlation IDs, structured redacted logs, traces and actionable alerts. Avoid high-cardinality labels and sensitive data.

### Day 26 — Docker and deployment
Use a multi-stage Dockerfile, non-root runtime, pinned dependencies, health/readiness checks, migration strategy, graceful shutdown and environment validation. Document local Compose startup, deployment, rollback and secrets management.

### Day 27 — Architecture decisions
Write ADRs comparing modular monolith vs gateway/BFF vs Federation. Include ownership boundaries, network hops, failure modes, deployment overhead and reversal signals. Do not adopt microservices or Federation for fashion.

### Day 28 — Federation lab
Create two independently runnable subgraphs (for example Catalog and Orders) plus a router. Compose schemas, resolve entities and propagate identity/tenant context. Test subgraph timeout, unavailable service and authorization failure.

### Day 29 — Hardening
Run threat-model review, adversarial query tests, load/soak tests and failure injection. Record p50/p95/p99, throughput, errors, DB pool saturation and resource use. Fix critical findings and document residual risk.

### Day 30 — Demonstration
From a clean clone: start dependencies, migrate, seed, run tests, start API and demonstrate authenticated CRUD, tenant isolation, nested query, pagination, cost rejection and event flow. Present architecture, dashboards, runbook and known limitations.

## Required repository commands

Every runnable app must document:
- install dependencies;
- validate environment/configuration;
- start dependencies;
- apply migrations and seed;
- run development server;
- type-check and lint;
- run unit and integration tests;
- build production artifact;
- start production artifact;
- inspect health/readiness.

Do not copy a command into a README until it exists in package scripts or the relevant toolchain.

## Quality gates

1. Correctness: types, validation, domain invariants and deterministic pagination.
2. Security: authn, object authz, tenant isolation, query cost and secret hygiene.
3. Performance: bounded queries, DataLoader, indexes, pool sizing and load evidence.
4. Reliability: timeouts, cancellation, graceful shutdown, retries and event semantics.
5. Operations: logs, metrics, traces, alerts, migrations, rollback and runbooks.
6. Maintainability: modules, tests, ADRs, pinned versions and understandable docs.

## Completion rule

A folder is complete only after its implementation exists, commands are verified, relevant tests pass and the learner can explain the trade-offs. The presence of this blueprint is not proof that those implementations have been completed.
