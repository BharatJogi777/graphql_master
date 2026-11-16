# Day 15 — Input Validation and Safe Errors

## Goal
Understand GraphQL input coercion, domain validation and stable client-facing error contracts.

## Run
```bash
npm install
npm test
npm run typecheck
npm run
```

## Study
- GraphQL validates required fields and scalar types before resolver execution.
- Domain rules (nonblank SKU, nonnegative price, uniqueness) belong in the application/domain layer.
- Use stable error codes such as `BAD_USER_INPUT` and `CONFLICT`.
- Normalize data consistently before uniqueness checks.
- A resolver can return partial data alongside errors; decide nullability based on failure semantics.

## Practice
1. Add a maximum name length and test boundary values.
2. Add a currency code and document the minor-unit convention.
3. Map a database unique-constraint violation to a safe conflict error.
4. Add request correlation IDs to server logs without returning internal details.
5. Test that SQL errors and stack traces never appear in client messages.

## Production note
Never trust client-side validation. Enforce invariants in the service and database. Do not expose raw database exceptions, stack traces, tokens or internal infrastructure details.
