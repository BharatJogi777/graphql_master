# Validation, execution and errors

> Status: implementation lab specification. Mark complete only after code and tests exist and have been run locally.

## Objective
Separate parse, validation, variable coercion and execution errors; implement safe domain error mapping.

## Deliverables
Malformed document tests, schema validation tests, variable coercion tests and execution error tests.

## Required acceptance evidence
- [ ] Verify no resolver runs for invalid documents; verify partial data and error path for field failures.
- [ ] Type-check and automated tests pass locally.
- [ ] Setup, run, migration and test commands are documented.
- [ ] No secrets, tokens or production data are committed.
- [ ] Failure behavior and operational limits are documented.

## Explain it back
Explain GraphQL errors array, data nullability and null bubbling.

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
