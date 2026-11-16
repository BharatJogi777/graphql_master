# Capstone — Multi-tenant Commerce GraphQL API

This is the shared domain reference for the course. It is a starting contract, not a finished server. Labs progressively implement the API and move responsibilities into production-grade modules.

## Domain
Tenants own users, products and orders. Users have CUSTOMER or ADMIN roles. Products have tenant-scoped unique SKUs, status and integer minor-unit prices. Orders contain items and status transitions.

## Files
- reference/schema.graphql — SDL contract to evolve through the labs.
- reference/prisma/schema.prisma — initial relational model.
- compose.yaml — local PostgreSQL 16 dependency.
- .env.example — local environment template (replace values; never commit a real .env).

## Start the database
From this directory:

```bash
cp .env.example .env
# Edit .env and set a strong local POSTGRES_PASSWORD.
docker compose up -d postgres
docker compose ps
```

The database is exposed on localhost:5434. The example Prisma datasource reads DATABASE_URL. Keep the password in .env consistent with the URL.

## Important implementation requirements
1. The reference files are not a complete NestJS API. Add the application package, Prisma client generation, migrations, seed, resolvers, services and tests in the relevant daily labs.
2. Enforce tenant scope in every read/write path. Do not trust tenant IDs from GraphQL inputs; derive tenant identity from verified request context.
3. The initial relational model does not express every cross-tenant invariant as a composite foreign key. Add database-level constraints or ensure the repository query/transaction guarantees that an Order's User and Product rows belong to the same tenant. Test attempted cross-tenant references.
4. Store money as integer minor units (BigInt in the database). Serialize BigInt as a string; do not use JavaScript floating point for monetary calculations.
5. Add a transaction for order creation and status changes. Define allowed state transitions in domain services.
6. Add deterministic keyset pagination, page-size limits, DataLoader, authorization, query-cost controls, logs, metrics and traces in their corresponding labs.
7. Never commit real .env files, tokens, production data or generated secrets.

## Suggested implementation order
Days 7–10 establish the NestJS app, persistence, relations and DataLoader. Days 12–19 add compatibility, auth, tenancy, pagination, caching and query safety. Days 22–26 add events, tests, telemetry and deployment. Days 27–30 evaluate Federation and harden the whole system.

## Local verification
At this initial stage only the PostgreSQL Compose file is provided. There is not yet an API package or migration command in this folder. Do not claim the capstone is runnable end-to-end until those are added and tested.
