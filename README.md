# GraphQL Mastery — End-to-End, Production Engineering

A practical engineering curriculum for a backend developer. The goal is to understand GraphQL internals, design stable schemas, implement secure and performant services, test them, deploy them and explain the trade-offs.

## Study commitment
- Target: 30 intensive days, about 5 focused hours/day (150 hours).
- Stack: TypeScript, NestJS, Apollo integration, PostgreSQL, Prisma, DataLoader, Jest and Docker Compose.
- Method: concept → internals → runnable implementation → tests → failure cases → production trade-offs.
- Pin dependency versions and use official documentation for the exact versions selected. Do not mix incompatible tutorial examples.

## Start here
1. [Learning guide](docs/00-learning-guide.md)
2. [Complete syllabus and coverage checklist](docs/01-syllabus-and-coverage.md)
3. [30-day plan](docs/02-30-day-plan.md)
4. [30 hands-on practice labs](docs/16-hands-on-practice-workbook.md)
5. [Capstone specification](docs/12-capstone-specification.md)
6. [Production readiness checklist](docs/13-production-readiness-checklist.md)
7. [Advanced GraphQL topics and production gaps](docs/17-advanced-graphql-topics.md)
8. [Completion evidence and verification matrix](docs/18-completion-evidence-matrix.md)

## Repository map
The `docs/` directory contains the learning guide, syllabus, daily plan, fundamentals, schema design, resolver execution, NestJS implementation, data access, security, client patterns, testing, architecture, capstone, readiness checklist, interview practice, glossary and workbook.

## 30-day project workspace

The day folders are created upfront to make the curriculum visible. **A folder containing only a README is a lesson scaffold, not a runnable project.** The current executable labs are:

- [Day 1 — GraphQL basics](projects/day-01-graphql-basics/README.md): Apollo Server, SDL, resolvers, in-memory data and execution tests.
- [Day 10 — N+1 and DataLoader](projects/day-10-n-1-and-dataloader/README.md): standalone Apollo Server, request-scoped DataLoader, metrics and automated tests.
- [Capstone API](projects/capstone/README.md): NestJS + Apollo + Prisma + PostgreSQL, Product/Customer/Order APIs, nested relationships, DataLoader and tests.

Days 2–9, 11–30 still need their own runnable implementations. They are not being counted as completed merely because their folders and lesson notes exist. The capstone is also incomplete: authentication, authorization, pagination, query limits, caching, subscriptions, observability, real PostgreSQL integration tests and deployment hardening remain.

| Days | Project focus |
|---|---|
| 1 | [GraphQL basics](projects/day-01-graphql-basics/README.md) |
| 2–6 | SDL/types, queries, mutations, resolver execution, validation and errors |
| 7–11 | NestJS/Apollo, PostgreSQL/Prisma, transactions, DataLoader, interfaces/unions/scalars |
| 12–15 | Schema evolution, authentication, authorization/tenancy, validation and safe errors |
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
