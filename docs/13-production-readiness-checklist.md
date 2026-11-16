
# 13 — Production Readiness Checklist

Check each item only when you have evidence (test, configuration, dashboard, runbook or review).

## API contract
- [ ] Schema reviewed against client use cases and domain boundaries.
- [ ] Nullability and error semantics documented.
- [ ] Inputs bounded and validated.
- [ ] Pagination deterministic and capped.
- [ ] Deprecation/compatibility process defined.
- [ ] Schema and operation checks in CI.

## Security
- [ ] TLS and secure secrets management.
- [ ] Authentication verifies signature, issuer, audience and expiry.
- [ ] Object, field and tenant authorization tested.
- [ ] DataLoader and caches correctly scoped/partitioned.
- [ ] Query depth and cost limits enabled.
- [ ] Alias/batching abuse and request/response size considered.
- [ ] Rate, concurrency and timeout limits configured.
- [ ] Introspection and IDE policy intentional.
- [ ] CORS/CSRF/cookie policy reviewed.
- [ ] Sensitive values redacted from logs/errors.
- [ ] Dependency/container scanning process defined.

## Performance and resilience
- [ ] N+1 measured and controlled.
- [ ] Indexes and query plans reviewed.
- [ ] DB connection pools bounded.
- [ ] Downstream timeouts and retry budgets defined.
- [ ] Retries do not amplify load or duplicate writes.
- [ ] Transactions protect domain invariants.
- [ ] Cache TTL and invalidation documented.
- [ ] Graceful shutdown/cancellation considered.
- [ ] Load/soak tests reflect realistic operations.

## Operations
- [ ] Structured logs and correlation IDs.
- [ ] Metrics for rate, errors, latency and saturation.
- [ ] Tracing across resolvers, DB and downstream services.
- [ ] Alerts tied to user impact/SLOs.
- [ ] Liveness/readiness probes.
- [ ] Migrations repeatable; rollback/recovery planned.
- [ ] Backup/restore understood.
- [ ] Runbook covers common incidents.
- [ ] Deployment and rollback tested.
- [ ] Capacity and subscription connection behavior documented.

## Incident runbook: elevated latency
1. Check request rate, p95/p99, errors and saturation.
2. Identify slow operation names/hashes and resolver spans.
3. Inspect DB pool, slow SQL, DataLoader batches and downstream spans.
4. Check query-cost distribution and client rollout.
5. Mitigate with rate/concurrency limits, operation disable/allowlist or dependency protection.
6. Record timeline, root cause, corrective action and regression test.

Never disable authorization or cost controls as a quick performance workaround.
