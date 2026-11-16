# Day 06 — Parsing, Validation, Coercion and Errors

## Goal
Separate GraphQL request processing into its distinct stages and design predictable errors.

## Run
```bash
npm install
npm test
npm run typecheck
npm run
```

## Request pipeline
1. Parse the source document into an AST.
2. Validate the AST against the schema (unknown fields, invalid arguments, fragment rules).
3. Coerce variable values against declared GraphQL input types.
4. Execute resolvers and complete the selected response tree.
5. Serialize data and any execution errors.

## Practice
1. Add a query with an undefined variable and inspect the validation error.
2. Pass a string where an Int is required and compare literal vs variable coercion.
3. Add a resolver that throws and inspect partial data plus the error path.
4. Return a GraphQLError with `extensions.code` and test the public error shape.

## Production note
Do not leak stack traces, SQL messages, tokens or internal hostnames to clients. Log detailed causes server-side and return stable, safe error codes.
