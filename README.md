
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
4. [Capstone specification](docs/12-capstone-specification.md)
5. [Production readiness checklist](docs/13-production-readiness-checklist.md)

## Repository map
| File | Contents |
|---|---|
| 00-learning-guide | Study method, prerequisites and mastery gates |
| 01-syllabus-and-coverage | Complete topic inventory and checklist |
| 02-30-day-plan | Daily schedule and deliverables |
| 03-graphql-fundamentals | GraphQL model, SDL, operations and lifecycle |
| 04-schema-design | Types, nullability, schema evolution and design |
| 05-execution-and-resolvers | Resolver execution, context and errors |
| 06-nestjs-apollo-implementation | Project structure and implementation sequence |
| 07-data-access-and-performance | N+1, DataLoader, SQL, caching and pagination |
| 08-authentication-authorization-security | Identity, authorization and abuse prevention |
| 09-client-pagination-subscriptions | Client cache, pagination and real-time |
| 10-testing-observability | Testing, logs, metrics and tracing |
| 11-advanced-architecture | BFF, gateways and Federation |
| 12-capstone-specification | Commerce/order system requirements |
| 13-production-readiness-checklist | Release gates and runbook |
| 14-interview-practice | Questions and scenario exercises |
| 15-glossary-and-references | Vocabulary and authoritative references |

## End-to-end outcome
You should be able to explain the request lifecycle; design a schema; implement queries, mutations, nested resolvers and custom types; secure object and tenant access; solve N+1; implement cursor pagination and subscriptions; protect against expensive operations; test and observe the service; deploy it; and justify whether Federation is warranted.

A 30-day plan builds strong practical competence, not guaranteed mastery of every vendor-specific feature or real production incident. Keep practicing advanced federation and operations after the course.

## Daily rhythm
60 minutes concepts/diagrams, 120 minutes implementation, 60 minutes debugging and edge cases, 60 minutes tests/review/interview explanation. Commit each day's work and maintain a learning log.
