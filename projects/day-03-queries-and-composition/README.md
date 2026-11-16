# Day 03 — Queries, Variables and Composition

## Goal
Write client operations using variables, aliases, fragments and multiple root fields.

## Run
```bash
npm install
npm test
npm run typecheck
npm run
```

## Study
- Variables keep dynamic values out of query strings and are declared with GraphQL types.
- Aliases change response property names, not schema field names.
- Fragments reuse selections for a particular object type.
- Multiple root fields let a client request related top-level resources in one operation.
- `operationName` chooses one operation when a document contains more than one.

## Practice
1. Add a query that accepts a list of user IDs and returns matching users.
2. Use aliases to request the same field with different arguments.
3. Create a fragment for Post and reuse it in two fields.
4. Observe what happens when a required variable is omitted or has the wrong type.
5. Inspect the GraphQL response shape and compare it with the selection set.

## Production note
Persisted operations and query allowlists can reduce arbitrary query exposure. Variables should be validated at the API boundary and never concatenated into query strings.
