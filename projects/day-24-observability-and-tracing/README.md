# Day 24 — Resolver Observability and Tracing

## Goal
Measure resolver latency and errors and understand the signals needed to operate a GraphQL service.

## Run
```bash
npm install
npm test
npm run typecheck
```

## Study
- GraphQL's nested resolver graph makes field-level attribution useful.
- Capture resolver duration, error count, operation name, request ID and downstream dependency spans.
- Avoid high-cardinality metric labels such as user IDs, raw query strings or arbitrary variables.
- Correlate GraphQL resolver spans with database and HTTP client spans.
- Separate client-visible safe errors from detailed server-side diagnostic logs.

## Practice
1. Add request ID and operation name to each metric record.
2. Add histograms and percentiles instead of only averages.
3. Instrument Prisma queries and external HTTP calls.
4. Add OpenTelemetry traces and export to Jaeger/Tempo.
5. Add a dashboard for p50/p95/p99 latency, error rate and N+1 query counts.

## Production note
This is an in-process metrics example, not OpenTelemetry instrumentation. In production, use OpenTelemetry SDK/exporters, structured logs, trace context propagation and bounded-cardinality metrics. Never put PII or secrets in span attributes.
