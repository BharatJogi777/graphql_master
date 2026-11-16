# Day 23 — GraphQL Testing Strategy

## Goal
Build confidence with schema contract tests, operation tests, mutation tests and negative cases.

## Run
```bash
npm install
npm test
npm run typecheck
npm run
```

## Study
- Unit-test domain services separately from GraphQL transport.
- Contract tests validate the public GraphQL response shape.
- Negative tests cover validation, coercion, authorization and domain failures.
- Integration tests should use a real database when validating persistence semantics.
- E2E tests should exercise the HTTP server, authentication and context construction.

## Practice
1. Add a test for authorization denial and partial data.
2. Run integration tests against a disposable PostgreSQL container.
3. Add test fixtures/builders instead of sharing mutable global state.
4. Add concurrency tests for idempotency and inventory reservation.
5. Add schema compatibility tests for saved client operations.

## Production note
This project tests GraphQL execution in-process. It is not a replacement for HTTP e2e tests. Keep tests deterministic, isolate database state and verify both success and failure behavior.
