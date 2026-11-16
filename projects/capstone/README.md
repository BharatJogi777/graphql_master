# GraphQL Capstone API

A progressive NestJS + Apollo Server + Prisma + PostgreSQL implementation for the 30-day GraphQL mastery curriculum.

## Implemented so far

- NestJS 11 bootstrap, validated environment configuration, Apollo GraphQL, PostgreSQL and Prisma.
- Product and customer list/detail queries plus create/update/delete mutations.
- Input validation, duplicate conflict handling, tenant-scoped persistence and safe deletion.
- Order queries and nested relationships: Customer → Orders → Order Items → Product.
- Request-scoped DataLoaders for customer, product, order and order-item relationships.
- Unit tests for services/loaders and GraphQL HTTP-level e2e tests using mocked Prisma.
- PostgreSQL migration with tenant-composite foreign keys, repeatable seed data, health checks and Docker setup.

## Security boundary

The current implementation uses a server-owned `demo-tenant` scope for learning. It is not production authentication. Do not deploy or expose this API publicly until JWT authentication, role authorization, tenant identity from a verified principal, rate limits and query-complexity controls are implemented.

## Requirements

- Node.js 20+
- npm
- Docker Desktop

## Local setup

```bash
cp .env.example .env
# Replace the sample password in POSTGRES_PASSWORD and DATABASE_URL.
docker compose -f compose.yaml up -d
npm install
npm run prisma:generate
npm run prisma:migrate:deploy
npm run db:seed
npm run start:dev
```

GraphQL: `http://localhost:3000/graphql`

To run the API and database as containers instead of starting NestJS on the host:

```bash
docker compose -f compose.app.yaml up --build
```

The Compose stack runs a one-shot migration container after PostgreSQL is healthy, then starts the non-root API container. The API image itself does not run migrations on every process start; use a dedicated migration Job/step in Kubernetes or another orchestrated production environment.

Health:
- `GET /api/health/live`
- `GET /api/health/ready`

## Relationship query

```graphql
query {
  customersList {
    id
    name
    orders {
      id
      status
      totalMinor
      items {
        quantity
        unitPriceMinor
        product { sku name }
      }
    }
  }
}
```

## Quality checks

```bash
npm run typecheck
npm test
npm run test:e2e
npm run build
```

These checks have not yet been run in the maintainer's local environment. The e2e suite uses mocked Prisma; a real PostgreSQL integration suite is still required.

## Architecture notes

- Monetary amounts are integer minor units, represented over GraphQL as strings.
- DataLoaders are instantiated per GraphQL request. Their caches are not shared between requests.
- Every DataLoader batch query applies the server-selected tenant.
- The SQL migration enforces tenant-consistent foreign keys for order users and order-item products.
- Resolver classes map GraphQL fields to services/loaders; persistence rules live in services.
- See `src/loaders/README.md` and `src/orders/README.md` for the N+1 explanation.

## Remaining milestones

JWT authentication, authorization, DataLoader integration with JWT-derived tenant scope, cursor pagination, query complexity/depth limits, caching, subscriptions, OpenTelemetry, real PostgreSQL integration tests, deployment hardening and the complete 30-day daily labs remain to be implemented.
