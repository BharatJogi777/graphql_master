# Queries, variables and composition

> Status: implementation lab specification. Mark complete only after code and tests exist and have been run locally.

## Objective
Implement list/detail/search queries with variables, aliases, fragments and operation naming.

## Deliverables
GraphQL operation files; variable examples; query tests; README with response examples.

## Required acceptance evidence
- [ ] Test missing required variables, invalid IDs, aliases and reusable fragments; verify selected fields only appear.
- [ ] Type-check and automated tests pass locally.
- [ ] Setup, run, migration and test commands are documented.
- [ ] No secrets, tokens or production data are committed.
- [ ] Failure behavior and operational limits are documented.

## Explain it back
Explain document vs operation, variables vs inline literals, and fragments.

## Suggested implementation sequence
1. Read the matching lesson in the docs directory and draw the request/data flow.
2. Implement the smallest working feature in this folder.
3. Add success, validation, authorization and failure tests appropriate to the topic.
4. Run the app and tests from a clean environment; record exact output and versions.
5. Review security, performance, observability and trade-offs before marking complete.

## Stack
TypeScript, NestJS, Apollo, PostgreSQL, Prisma, DataLoader, Jest and Docker Compose as introduced by the curriculum. Use version-compatible dependencies and document deliberate alternatives.

## Learning log
- Implementation:
- Tests run and result:
- Design trade-offs:
- Bugs found and fixed:
- Remaining limitations:
