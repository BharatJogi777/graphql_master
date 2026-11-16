# Day 02 — Schema Definition Language and Types

## Goal
Define a GraphQL contract with object types, enums, IDs, non-null fields and nullable fields.

## Run
```bash
npm install
npm test
npm run typecheck
npm run
```

## Study
- `type` declares an object type; clients select fields from it.
- `ID!` is a required identifier argument. `!` means non-null.
- `String` is nullable. A nullable description can legitimately resolve to `null`.
- Enums constrain inputs and outputs to a known set of values.
- SDL describes the public contract; `rootValue` supplies root query resolvers in this small lab.

## Practice
1. Add a `category: String!` field to Product and populate every fixture.
2. Add `productsByName(prefix: String!): [Product!]!`.
3. Add a `ProductStatus` value and verify invalid enum values fail before resolver execution.
4. Explain the difference between `[Product]`, `[Product!]`, `[Product!]!` and `[Product]!`.

## Production note
Do not expose database models directly as your GraphQL contract. Keep schema types intentional and document nullability as part of the API design.
