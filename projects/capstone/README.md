# GraphQL Capstone API

A progressive NestJS + Apollo Server + Prisma + PostgreSQL implementation for the 30-day GraphQL mastery curriculum.

## Current implementation status

Implemented foundation and first catalog slice:

- NestJS 11 bootstrap, validated environment configuration, and Apollo GraphQL.
- Code-first GraphQL schema for products and customers (the Prisma `User` model).
- Product and customer list/detail queries plus create/update/delete mutations.
- Prisma-backed services with tenant-scoped queries and writes.
- Input validation, duplicate SKU/email conflict handling, and safe deletion behavior.
- Money represented as integer minor units and serialized as a string.
- PostgreSQL migration with tenant-composite foreign keys.
- Liveness/readiness endpoints, service unit tests, and GraphQL HTTP-level e2e tests with mocked persistence.
- Docker image and Compose stacks for PostgreSQL-only or API + PostgreSQL.

**Security boundary:** this learning milestone uses a hard-coded `demo-tenant` scope so no client can choose another tenant. It is not production authentication. Do not deploy or expose this API publicly until JWT authentication, role authorization, rate limits, and tenant identity from a verified principal are implemented.

## Requirements

- Node.js 20+
- npm
- Docker Desktop (for PostgreSQL / Compose)

## Local setup

```bash
cp .env.example .env
# Replace the sample password in POSTGRES_PASSWORD and DATABASE_URL with the same local password.
docker compose -f compose.yaml up -d
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

## Example operations

```graphql
query {
  productsList { id sku name priceMinor currency status }
  customersList { id email name role }
}
```

```graphql
mutation CreateProduct($input: CreateProductInput!) {
  createProduct(input: $input) { id sku name priceMinor status }
}
```

Variables:

```json
{
  "input": {
    "sku": "SKU-100",
    "name": "Wireless Keyboard",
    "description": "Compact keyboard",
    "priceMinor": "249900",
    "currency": "INR",
    "status": "ACTIVE"
  }
}
```

See `src/products/README.md` and `src/customers/README.md` for complete operations and design decisions.

## Run the full container stack

Create `.env` with `POSTGRES_PASSWORD`, then:

```bash
docker compose --env-file .env -f compose.app.yaml up --build
```

The API container applies committed Prisma migrations before starting. The database port is bound to localhost only.

## Quality checks

```bash
npm run typecheck
npm test
npm run test:e2e
npm run build
```

These commands are documented; they must be run in your environment before treating the current commit as verified.

## Important engineering decisions

- All monetary values are integer minor units. GraphQL accepts and returns a string to avoid 32-bit GraphQL Int and JavaScript floating-point precision problems.
- Tenant ID is not a GraphQL argument or caller-controlled header. The temporary demo scope is server-owned and will be replaced with JWT principal scope in the authentication milestone.
- Composite foreign keys ensure an order's user and each order item's product belong to the same tenant as the order.
- Liveness does not depend on PostgreSQL. Readiness performs a database probe.
- Products referenced by order items and customers referenced by orders cannot be deleted.
- Resolver classes map GraphQL operations to services; persistence and business rules remain in services.

## Learning sequence

Follow `../../docs/02-30-day-plan.md` and `../../docs/19-complete-implementation-blueprint.md`. Authentication, DataLoader, pagination, query safety, observability, and deployment hardening remain upcoming milestones.
