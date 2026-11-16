# Day 05 — Resolver Execution and Parent Values

## Goal
Understand how GraphQL executes a selection tree and passes each resolved object to child-field resolvers.

## Run
```bash
npm install
npm test
npm run typecheck
npm run
```

## Study
- A resolver receives `source/parent`, `args`, `context` and `info`.
- Root resolvers begin at Query or Mutation fields.
- A nested resolver receives the object returned by its parent field.
- The default field resolver reads a property with the same name as the GraphQL field.
- Only selected fields are included in the response; resolvers for unselected fields are not run.
- Resolver execution can branch and sibling fields may execute concurrently.

## Practice
1. Add `User.postCount` and calculate it without returning the full posts array.
2. Add a `Post.excerpt` resolver that uses the title.
3. Log parent IDs and explain why `Post.author` receives a Post, not a User.
4. Add a missing-author fixture and observe non-null error propagation.

## Production note
Keep resolvers thin. Delegate persistence and business rules to services. Avoid putting request-specific state in module-level globals.
