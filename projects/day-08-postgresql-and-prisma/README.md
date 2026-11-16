# Day 08 — PostgreSQL and Prisma

## Goal
Connect a TypeScript application to PostgreSQL with Prisma, model data and implement a repository.

## Start PostgreSQL
```bash
cp .env.example .env
docker compose up -d
npm install
npm run db:generate
npm run db:migrate -- --name init
npm run db:seed
```

## Verify
```bash
npm test
npm run typecheck
npm run db:studio
```

The database is exposed on host port **5437** to avoid colliding with a local PostgreSQL instance. Integration tests require the database to be running and migrated.

## Study
- Prisma schema models map to relational tables; `@map` and `@@map` decouple TypeScript naming from SQL naming.
- `@id`, `@unique`, indexes and enum values become database constraints or structures.
- `findMany`, `findUnique`, `create` and `upsert` are generated from the schema.
- Store money as integer minor units (for example, paise/cents), not floating-point values.
- A repository hides persistence details from resolver code.

## Practice
1. Add a Category model and a Product-to-Category relation.
2. Add a database index for a real query you expect to run.
3. Inspect the generated SQL migration and explain each statement.
4. Use EXPLAIN ANALYZE against a larger fixture dataset.
5. Add a unique-constraint test for duplicate SKUs.

## Production note
Use migrations in deployment, not `db push`. Keep secrets out of Git, size the connection pool, and use transactions for multi-step writes. Review indexes against actual query plans.
