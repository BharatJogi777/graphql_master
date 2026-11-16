
# 10 — Testing and Observability

## Testing pyramid
- Unit: services, policies, validation and pure mapping.
- Resolver: GraphQL args/context adaptation and service calls.
- Schema/operation: operation validates and returns expected shape.
- Integration: real PostgreSQL, migrations, DataLoader and transactions.
- E2E: HTTP, auth, GraphQL execution and response.
- Contract: representative client operations remain valid after schema changes.
- Load/soak: concurrency, latency, saturation, memory and connection behavior.

Mocking every dependency can hide SQL/transaction bugs. Use disposable test DBs for critical integration paths.

## Test matrix
For each operation test valid input, invalid input, missing record, unauthenticated caller, authenticated-but-unauthorized caller, cross-tenant access, DB/downstream failure, nullability/partial data, pagination boundaries and cost-limit rejection.

## Observability
Use structured logs, metrics and distributed tracing. Capture operation name or safe hash, request ID, total/resolver latency, safe error code, DB query count/latency, downstream latency, DataLoader batch size/cache hits, query depth/cost/rejections and subscription delivery health.

Avoid logging raw variables by default; they may contain passwords, personal data or tokens. Redact and control retention/access.

## Metrics
Track request rate, error rate, latency percentiles, saturation, DB pool use, slow operations, cost-limit rejections, cache hit rates and subscription health. Define SLOs from product needs.

## Exercises
1. Unit-test order business rules.
2. E2E-test query/mutation and auth failures.
3. Run tests against PostgreSQL migrations.
4. Add a slow resolver and trace it to SQL.
5. Add request IDs and structured logs.
6. Load-test representative operations with bounded data.
7. Report p50/p95/p99, errors, throughput and resources.
8. Add regression tests for every performance/security bug.

Acceptance: diagnose failures from telemetry without exposing sensitive data; test suite covers major trust boundaries.
