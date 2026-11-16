# Day 11 — Interfaces, Unions and Custom Scalars

## Goal
Model polymorphic results and define a custom DateTime scalar.

## Run
```bash
npm install
npm test
npm run typecheck
npm run
```

## Study
- Interfaces define fields shared by multiple object types.
- Unions combine object types that do not need common fields.
- Clients use `__typename` and inline fragments to select concrete-type fields.
- Custom scalars own parsing, variable coercion and serialization rules.
- A DateTime scalar should define one canonical wire representation (this lab uses ISO-8601 UTC).

## Practice
1. Add a Comment type implementing Node.
2. Add a union member and test fragment matching.
3. Reject non-ISO date values in both variables and literals.
4. Decide whether a Money scalar is worth adding or whether integer minor units are clearer.

## Production note
Custom scalars are contracts. Document format, timezone, precision, invalid-input behavior and client code-generation mapping.
