# Day 30 — Final GraphQL Engineering Capstone

## Goal
Bring schema design, mutations, idempotency, tenant scoping, pagination bounds, safe errors and HTTP operations into one final exercise.

## Run
```bash
npm install
npm test
npm run typecheck
npm run
```

Server listens on port 4000 by default. GraphQL endpoint is `POST /graphql`; health endpoints are `/health/live` and `/health/ready`.

## Example request
```bash
curl -s http://localhost:4000/graphql \
  -H 'content-type: application/json' \
  -H 'x-tenant-id: tenant-demo' \
  --data '{"query":"{ health products { id sku name priceMinor } }"}'
```

## What is included
- GraphQL schema with query and mutation operations.
- Input validation and stable error codes.
- Tenant-scoped product list and tenant-scoped idempotency keys.
- Bounded page size and simple after-ID pagination.
- HTTP health endpoints, request size limit and graceful server close.
- Automated contract and behavior tests.

## Final assessment
1. Replace in-memory state with PostgreSQL and Prisma.
2. Implement real JWT verification; never trust the demo tenant header.
3. Replace after-ID pagination with a stable cursor based on indexed ordering.
4. Add DataLoader for nested product/customer/order relationships.
5. Add query complexity limits, rate limiting and persisted operations.
6. Add OpenTelemetry traces, structured logs and metrics.
7. Add Docker/Kubernetes deployment and load tests.
8. Produce an architecture diagram, threat model, SLOs and incident runbook.

## Honest scope
This is a final learning reference, not a production-ready commerce API. It intentionally keeps persistence in memory and demonstrates the core application contracts. Production readiness requires durable database constraints, verified identity, database-level tenant enforcement, concurrency-safe idempotency, robust cursor pagination, query budgets, operational telemetry and load/security testing.
