# Day 1 — GraphQL Basics

A small, runnable Apollo Server project for learning the GraphQL schema, query execution, arguments, nested fields and resolvers.

## Requirements

- Node.js 20 or newer
- npm

## Run locally

```bash
cd projects/day-01-graphql-basics
npm install
npm run dev
```

Open the GraphQL endpoint printed in the terminal (normally http://localhost:4000/).

## Example operations

Fetch one order:

```graphql
query GetOrder($id: ID!) {
  order(id: $id) {
    id
    status
    totalAmount
    customer {
      id
      name
    }
  }
}
```

Variables:

```json
{ "id": "ord-101" }
```

Fetch customers and their orders:

```graphql
{
  customer(id: "cus-1") {
    id
    name
    orders {
      id
      status
    }
  }
}
```

Fetch all orders:

```graphql
{
  orders {
    id
    status
    totalAmount
  }
}
```

## Verify the project

```bash
npm test
npm run typecheck
```

## What to inspect

1. `src/schema.ts`: the schema is the API contract.
2. `src/resolvers.ts`: root and nested field resolvers.
3. `src/data.ts`: temporary in-memory data source.
4. `src/server.ts`: Apollo Server startup.
5. `tests/graphql.test.ts`: execute GraphQL operations without starting an HTTP server.

## Deliberate learning limitation

This first project uses in-memory data. It does not yet include NestJS, PostgreSQL, Prisma, authentication or production hardening. Those are added in later projects after the underlying GraphQL execution model is clear.

## Practice tasks

- Add a `customers: [Customer!]!` query.
- Add a `customerCount: Int!` field to the Query type.
- Add an `orderCount: Int!` field to the Query type.
- Change the sample data and add a test for a customer with no orders.
- Explain why `Order.customer` and `Customer.orders` are nested resolvers rather than database joins performed automatically by GraphQL.
