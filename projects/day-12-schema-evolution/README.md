# Day 12 — Schema Evolution and Compatibility

## Goal
Evolve a public GraphQL contract without unexpectedly breaking existing clients.

## Run
```bash
npm install
npm test
npm run typecheck
npm run
```

## Study
- Additive nullable or safely defaulted fields are usually the least disruptive changes.
- Deprecation communicates migration intent while preserving the old field temporarily.
- A deprecated field remains executable until it is removed.
- Removing or changing a field's type can break existing operations.
- Compatibility should be checked against real client operations, not only schema diffs.

## Practice
1. Add a deprecation to an old argument and introduce its replacement.
2. Write a script that validates a directory of saved operations against the schema.
3. Create a schema change report that classifies additive, dangerous and breaking changes.
4. Define a sunset policy and telemetry requirement before removing deprecated fields.

## Production note
Use operation/client telemetry to prove a deprecated field is unused. Communicate migration windows and validate persisted operations before deployment.
