
# 02 — 30-Day Plan (Five Hours Daily)

| Day | Focus | Hands-on deliverable |
|---:|---|---|
| 1 | GraphQL mental model, REST comparison, lifecycle | Request lifecycle diagram and hello query |
| 2 | SDL, scalars, object types and fields | Product/User schema |
| 3 | Queries, variables, aliases and fragments | Search/list/detail operations |
| 4 | Mutations, inputs, enums and nullability | Create/update product mutations |
| 5 | Resolver signatures and nested fields | Product → category → products |
| 6 | Validation, execution, default resolver and errors | Compare validation and execution errors |
| 7 | NestJS GraphQL module | Boot app and generate schema |
| 8 | Services, repositories and PostgreSQL/Prisma | Database-backed product CRUD |
| 9 | Relations, transactions and consistency | Create order + items atomically |
| 10 | N+1 and DataLoader | Before/after SQL query count |
| 11 | Interfaces, unions and custom scalars | Search result union and DateTime |
| 12 | Schema design and evolution | Deprecation and compatibility exercise |
| 13 | Authentication and context | JWT validation and me query |
| 14 | Authorization and tenant isolation | Owner/admin checks with negative tests |
| 15 | Validation and safe error model | Domain errors and input constraints |
| 16 | Pagination | Offset and cursor comparison |
| 17 | Relay connection model | edges, cursor and pageInfo |
| 18 | Caching | Request/application cache and invalidation |
| 19 | Query safety | Depth, cost, size, rate and concurrency limits |
| 20 | Client and code generation | Typed operations |
| 21 | Client cache and optimistic updates | Cache update and rollback |
| 22 | Subscriptions | Authorized order status event |
| 23 | Subscription failure modes | Reconnect, duplicate and pub/sub design |
| 24 | Testing strategy | Unit, integration, schema and auth suite |
| 25 | Observability | Logs, metrics, traces and slow resolver diagnosis |
| 26 | Docker and deployment | Containers, migrations and health checks |
| 27 | Architecture choices | Monolith, BFF and Federation comparison |
| 28 | Federation lab | Two-subgraph proof of concept or documented decision not to federate |
| 29 | Capstone hardening | Load test, security review and failure injection |
| 30 | Final review | Demo, ADR, runbook and interview defense |

## Daily time split
60 min concepts/diagrams; 120 min implementation; 60 min tests/debugging; 60 min review and interview explanation.

## Exit gates
Day 7: explain schema, operations, validation and resolver execution.
Day 14: demonstrate DB-backed nested resolvers, DataLoader and authorization.
Day 21: demonstrate pagination, caching, cost controls and client cache.
Day 30: demonstrate capstone, tests, observability, deployment and trade-offs.

The calendar is a target, not a reason to carry half-understood concepts forward. If an exit gate fails, repair the gap before advancing.
