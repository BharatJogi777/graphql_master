# GraphQL Capstone API

A progressive NestJS + Apollo Server + Prisma + PostgreSQL implementation for the 30-day GraphQL mastery curriculum.

## Current implementation status

This directory now contains the first runnable application foundation:

- NestJS 11 application bootstrap and validated environment configuration.
- Apollo GraphQL module with code-first schema generation and an `apiStatus` query.
- Prisma 6 service lifecycle integration and a PostgreSQL data model.
- An initial SQL migration with tenant-composite foreign keys that prevent cross-tenant order/user/product references.
- Liveness and database-readiness endpoints with unit tests.
- Docker image and a Compose stack for PostgreSQL + API.
- Small local seed dataset.

The commerce operations, authentication, authorization, DataLoader, pagination, query limits, and observability are deliberately implemented in later curriculum milestones. Do not treat this foundation as a complete production commerce API.

## Requirements

- Node.js 20+
- npm
- Docker Desktop (for PostgreSQL / Compose)

## Local setup

```bash
cp .env.example .env
# Set a strong local POSTGRES_PASSWORD and matching DATABASE_URL in .env
npm install
npm run prisma:generate
npm run prisma:migrate:deploy
npm run db:seed
npm run start:dev
```

GraphQL endpoint: `http://localhost:3000/graphql`

Health endpoints:
- `GET http://localhost:3000/api/health/live`
- `GET http://localhost:3000/api/health/ready`

Example GraphQL operation:

```graphql
query {
  apiStatus
}
```

Expected data:

```json
{ "data": { "apiStatus": "GraphQL API is ready" } }
```

## Run PostgreSQL only

The existing `compose.yaml` starts the database dependency. Start it from this directory:

```bash
docker compose -f compose.yaml up -d
```

Then run the application on the host using the local `DATABASE_URL`.

## Run the full container stack

Create `.env` with `POSTGRES_PASSWORD`, then:

```bash
docker compose --env-file .env -f compose.app.yaml up --build
```

The API container applies committed Prisma migrations before starting. The database port is bound to localhost only.

## Quality checks

```bash
npm run typecheck
npm test -- --runInBand
npm run build
```

These commands are documented; they must be run in your environment before treating the current commit as verified.

## Important engineering decisions

- All monetary values are integer minor units (`priceMinor`, `totalMinor`); never use floating-point arithmetic for money.
- Prisma represents PostgreSQL `BIGINT` as JavaScript `bigint`. GraphQL scalar serialization will be added with the money/product API milestone.
- Tenant IDs must come from authenticated request context, not arbitrary client-supplied arguments.
- Composite foreign keys ensure an order's user and each order item's product belong to the same tenant as the order.
- Liveness does not depend on PostgreSQL. Readiness performs a database probe.
- Introspection is configurable and should be disabled in production unless explicitly required.

## Learning sequence

Follow `../../docs/02-30-day-plan.md` and `../../docs/19-complete-implementation-blueprint.md`. Each later milestone will add one bounded capability with tests and an explanation.
