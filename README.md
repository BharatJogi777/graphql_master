# GraphQL Mastery — End-to-End, Production Engineering

A practical engineering curriculum for a backend developer. The goal is to understand GraphQL internals, design stable schemas, implement secure and performant services, test them, deploy them and explain the trade-offs.

## Study commitment
- Target: 30 intensive days, about 5 focused hours/day (150 hours).
- Stack: TypeScript, NestJS, Apollo, PostgreSQL, Prisma, DataLoader, tests and Docker Compose.
- Method: concept → internals → runnable implementation → tests → failure cases → production trade-offs.

## Start here
1. [Learning guide](docs/00-learning-guide.md)
2. [Complete syllabus and coverage checklist](docs/01-syllabus-and-coverage.md)
3. [30-day plan](docs/02-30-day-plan.md)
4. [30 hands-on practice labs](docs/16-hands-on-practice-workbook.md)
5. [Capstone specification](docs/12-capstone-specification.md)
6. [Production readiness checklist](docs/13-production-readiness-checklist.md)
7. [Advanced GraphQL topics and production gaps](docs/17-advanced-graphql-topics.md)
8. [Completion evidence and verification matrix](docs/18-completion-evidence-matrix.md)

## 30-day project workspace

A folder containing only a README is a lesson scaffold, not a runnable project. Current daily project implementations:

- [Day 1 — GraphQL basics](projects/day-01-graphql-basics/README.md)
- [Day 2 — SDL and types](projects/day-02-sdl-and-types/README.md)
- [Day 3 — Queries and composition](projects/day-03-queries-and-composition/README.md)
- [Day 4 — Mutations](projects/day-04-mutations/README.md)
- [Day 5 — Resolver execution](projects/day-05-resolver-execution/README.md)
- [Day 6 — Validation and errors](projects/day-06-validation-and-errors/README.md)
- [Day 7 — NestJS and Apollo](projects/day-07-nestjs-and-apollo/README.md)
- [Day 8 — PostgreSQL and Prisma](projects/day-08-postgresql-and-prisma/README.md)
- [Day 9 — Relations and transactions](projects/day-09-relations-and-transactions/README.md)
- [Day 10 — N+1 and DataLoader](projects/day-10-n-1-and-dataloader/README.md)
- [Capstone API](projects/capstone/README.md): NestJS + Apollo + Prisma + PostgreSQL, catalog/customer/order APIs, nested relationships and request-scoped DataLoader.

**Status:** Days 1–10 now have implementation files. Days 11–30 still need runnable implementations. The capstone remains in progress; authentication, authorization, pagination, query limits, caching, subscriptions, observability, real PostgreSQL integration tests and deployment hardening remain. Code has been committed incrementally, but the new projects still need to be installed and executed locally; do not treat a commit as a passing test report.

## Remaining curriculum
| Days | Project focus |
|---|---|
| 11–15 | Interfaces/unions/scalars, schema evolution, authentication, authorization/tenancy, validation and safe errors |
| 16–21 | Pagination, Relay connections, caching, query safety, client code generation and client cache |
| 22–26 | Subscriptions, subscription reliability, testing, observability, Docker and deployment |
| 27–30 | Architecture decisions, Federation, capstone hardening and final demo/runbook |

## End-to-end outcome
You should be able to explain the request lifecycle; design a schema; implement queries, mutations, nested resolvers and custom types; secure object and tenant access; solve N+1; implement cursor pagination and subscriptions; protect against expensive operations; test and observe the service; deploy it; and justify whether Federation is warranted.

A 30-day plan builds strong practical competence, not guaranteed mastery of every vendor-specific feature or real production incident. Keep practicing advanced federation and operations after the course.

## Daily rhythm
60 minutes concepts/diagrams, 120 minutes implementation, 60 minutes debugging and edge cases, 60 minutes tests/review/interview explanation. Commit each day's work and maintain a learning log.

## Capstone implementation
The `projects/capstone/` directory is the shared multi-tenant commerce application used to connect the daily labs. See [Capstone README](projects/capstone/README.md), [implementation blueprint](docs/19-complete-implementation-blueprint.md), [Day 10 standalone lab](projects/day-10-n-1-and-dataloader/README.md) and the [completion evidence matrix](docs/18-completion-evidence-matrix.md).
