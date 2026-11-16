# Mutations and input design

> Status: implementation lab specification. Mark complete only after code and tests exist and have been run locally.

## Objective
Implement create, update and archive product mutations with input objects and enums.

## Deliverables
Mutation resolvers, service methods, validation and mutation integration tests.

## Required acceptance evidence
- [ ] Test success, duplicate SKU, not found, invalid input and idempotency; never accept arbitrary database fields.
- [ ] Type-check and automated tests pass locally.
- [ ] Setup, run, migration and test commands are documented.
- [ ] No secrets, tokens or production data are committed.
- [ ] Failure behavior and operational limits are documented.

## Explain it back
Explain input/output type separation, serial root mutation execution and transactional writes.

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
