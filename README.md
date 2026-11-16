# GraphQL Mastery — End-to-End, Production Engineering

A practical 30-day curriculum for a backend engineer. Learn GraphQL internals, schema design, resolver execution, security, performance, client integration, subscriptions, testing, observability, deployment and Federation through hands-on projects.

## Stack
TypeScript, GraphQL.js, NestJS, Apollo Server, Apollo Client, PostgreSQL, Prisma, DataLoader, Jest/Node test runner, Docker Compose and Kubernetes.

## Start here
1. [Learning guide](docs/00-learning-guide.md)
2. [Complete syllabus and coverage checklist](docs/01-syllabus-and-coverage.md)
3. [30-day plan](docs/02-30-day-plan.md)
4. [Hands-on practice workbook](docs/16-hands-on-practice-workbook.md)
5. [Capstone specification](docs/12-capstone-specification.md)
6. [Production readiness checklist](docs/13-production-readiness-checklist.md)
7. [Advanced GraphQL topics](docs/17-advanced-graphql-topics.md)
8. [Completion evidence matrix](docs/18-completion-evidence-matrix.md)
9. [Code review and verification status](docs/20-code-review-status.md)

## Daily runnable projects

Each daily folder includes implementation files, tests and a README. Some labs are intentionally small in-memory examples to isolate one concept; database and deployment labs include their own infrastructure/configuration.

| Day | Practical project |
|---|---|
| 1 | [GraphQL basics](projects/day-01-graphql-basics/README.md) |
| 2 | [SDL and types](projects/day-02-sdl-and-types/README.md) |
| 3 | [Queries and composition](projects/day-03-queries-and-composition/README.md) |
| 4 | [Mutations](projects/day-04-mutations/README.md) |
| 5 | [Resolver execution](projects/day-05-resolver-execution/README.md) |
| 6 | [Validation and errors](projects/day-06-validation-and-errors/README.md) |
| 7 | [NestJS and Apollo](projects/day-07-nestjs-and-apollo/README.md) |
| 8 | [PostgreSQL and Prisma](projects/day-08-postgresql-and-prisma/README.md) |
| 9 | [Relations and transactions](projects/day-09-relations-and-transactions/README.md) |
| 10 | [N+1 and DataLoader](projects/day-10-n-1-and-dataloader/README.md) |
| 11 | [Interfaces, unions and scalars](projects/day-11-interfaces-unions-and-scalars/README.md) |
| 12 | [Schema evolution](projects/day-12-schema-evolution/README.md) |
| 13 | [Authentication and context](projects/day-13-authentication-context/README.md) |
| 14 | [Authorization and tenancy](projects/day-14-authorization-and-tenancy/README.md) |
| 15 | [Input validation and safe errors](projects/day-15-input-validation-and-safe-errors/README.md) |
| 16 | [Offset and cursor pagination](projects/day-16-pagination/README.md) |
| 17 | [Caching and invalidation](projects/day-17-caching-and-cache-control/README.md) |
| 18 | [Query depth and cost limits](projects/day-18-query-cost-and-depth-limits/README.md) |
| 19 | [Operation code generation](projects/day-19-operation-codegen/README.md) |
| 20 | [Apollo Client cache](projects/day-20-apollo-client-cache/README.md) |
| 21 | [GraphQL subscriptions](projects/day-21-graphql-subscriptions/README.md) |
| 22 | [Subscription reliability](projects/day-22-subscription-reliability/README.md) |
| 23 | [GraphQL testing](projects/day-23-graphql-testing/README.md) |
| 24 | [Observability and tracing](projects/day-24-observability-and-tracing/README.md) |
| 25 | [Docker deployment](projects/day-25-docker-deployment/README.md) |
| 26 | [Kubernetes production manifests](projects/day-26-kubernetes-production-manifests/README.md) |
| 27 | [Federation subgraph](projects/day-27-federation-subgraph/README.md) |
| 28 | [Federation composition](projects/day-28-federation-composition/README.md) |
| 29 | [Capstone hardening](projects/day-29-capstone-hardening/README.md) |
| 30 | [Final GraphQL capstone](projects/day-30-final-capstone/README.md) |

## Shared capstone

The [main capstone](projects/capstone/README.md) is the larger NestJS + Apollo + Prisma + PostgreSQL commerce API. It includes catalog/customer/order operations, nested relationships and request-scoped DataLoader. It is still an evolving project; use its README and [implementation blueprint](docs/19-complete-implementation-blueprint.md) for current scope.

## How to study each day
- Understand the concept and draw the request/data flow.
- Install dependencies and run the tests.
- Run the example and modify it.
- Complete every practice exercise.
- Add at least one failure-path test.
- Explain the production trade-offs in your own words.

## Verification status

The daily projects have been authored and committed incrementally. They have **not all been executed in a clean local environment** as part of these commits. Treat the tests as provided verification work to run locally—not as a claim that every project already passes. Some labs are intentionally educational rather than production-ready; each README calls out its scope and next production steps.

## Completion target

By the end, you should be able to design, implement, secure, test, optimize, observe and deploy a GraphQL service, and explain when a monolith, modular GraphQL API or federated architecture is appropriate. Thirty days is a structured intensive learning plan, not a guarantee of complete mastery; continue with real workloads, incident practice and deeper platform-specific work.
