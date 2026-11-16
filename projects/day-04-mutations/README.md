# Day 04 — Mutations and Input Objects

## Goal
Implement state-changing operations with input objects, enums, defaults and validation.

## Run
```bash
npm install
npm test
npm run typecheck
npm run
```

## Study
- Mutations are the schema entry point for writes.
- Input object types are separate from output object types.
- Required input fields use `!`; optional fields may be omitted or null when nullable.
- Enum defaults are applied during input coercion.
- GraphQL validates/coerces inputs before invoking the resolver.

## Practice
1. Add `updateProduct(id: ID!, input: UpdateProductInput!)`.
2. Decide whether omitted and explicit-null descriptions mean the same thing.
3. Add a domain validation error for negative prices.
4. Add a test proving invalid input never changes the store.

## Production note
A GraphQL mutation is not automatically a database transaction. Use a transaction for multi-row invariants and enforce business rules in the service/domain layer too.
