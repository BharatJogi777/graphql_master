# PostgreSQL and Prisma

> Status: implementation lab specification. Mark complete only after code and tests exist and have been run locally.

## Objective
Replace in-memory product/customer data with PostgreSQL persistence and Prisma migrations.

## Deliverables
Prisma schema, migration, seed, repository/service boundary and integration tests.

## Required acceptance evidence
- [ ] Fresh database migration and seed work; CRUD persists; DB unavailable behavior is safe.
- [ ] Type-check and automated tests pass locally.
- [ ] Setup, run, migration and test commands are documented.
- [ ] No secrets, tokens or production data are committed.
- [ ] Failure behavior and operational limits are documented.

## Explain it back
Explain connection pooling, migrations, repository boundaries and raw SQL trade-offs.

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
