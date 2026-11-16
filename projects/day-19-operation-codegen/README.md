# Day 19 — Typed Operations and GraphQL Code Generation

## Goal
Generate compile-time TypeScript types and typed document nodes from the schema and client operations.

## Run
```bash
npm install
npm test
npm run codegen
npm run typecheck
```

Generated output is written to `src/gql/`. Commit generated artifacts only if that is your team's chosen workflow; otherwise generate them in CI/build and ensure schema and operation sources are versioned.

## Study
- Schema types describe the server contract; operation types describe exactly what a client selected.
- Generated operation result types prevent reading fields the query did not request.
- Variable types are derived from operation variable definitions.
- Code generation catches schema/client drift during development, not at runtime.
- Keep the schema snapshot synchronized with the deployed API.

## Practice
1. Add a mutation and generate its input/result types.
2. Add an enum variable and verify the generated union.
3. Introduce a nullable field and inspect generated TypeScript.
4. Validate every operation document in the repository as part of the build.
5. Add a schema download step from a protected staging endpoint.

## Production note
Never hand-edit generated files. Pin codegen versions, validate schema compatibility in CI, and treat generated types as build artifacts from trusted schema/operation inputs.
