
# 16 — Hands-on Practice Workbook (30 Labs)

Use this workbook with the daily plan. Every lab must be committed separately or as a clearly named daily commit. Keep all examples in the same capstone so that each topic builds on previous work.

## Lab rules
- Write the operation first; do not start by copying a resolver.
- Add a positive test, a negative test and a boundary test.
- Record the expected response and actual response.
- Inspect SQL and logs for data-access topics.
- Do not store real credentials or customer data.
- At the end, explain the implementation and trade-offs without notes.

## Week 1 — Fundamentals and execution

### Lab 1: Hello GraphQL
Create a NestJS GraphQL server and a Query field named hello returning a string. Run a named query. Record the HTTP request and JSON response. Add an unknown-field query and record the validation error.

### Lab 2: Product schema
Create Product with ID, name, description, price and inStock. Add Query.product and Query.products. Decide nullability and explain each wrapper. Test missing product and empty product list.

### Lab 3: Variables, aliases and fragments
Create a query that fetches two products with aliases. Move IDs to variables. Create a reusable ProductSummary fragment. Verify operation name appears in server logs.

### Lab 4: Mutation and input
Create CreateProductInput and createProduct mutation. Validate name length and non-negative price. Test missing input, invalid price and valid input. Ensure the server, not the client, generates the ID.

### Lab 5: Nested resolver
Add Category and Product.category. First resolve from an already-loaded parent property; then resolve through a service. Compare resolver behavior and explain when default field resolution is sufficient.

### Lab 6: Execution and null bubbling
Create a nullable field and a non-null field. Make each resolver return null in turn. Capture data/errors/path. Compare an unknown-field validation error with a resolver execution error.

### Lab 7: SDL versus code-first
Represent the same small schema in SDL and NestJS code-first decorators. Compare readability, generated schema, type safety and team workflow. Keep one primary approach for the capstone.

## Week 2 — Data and server-side design

### Lab 8: PostgreSQL persistence
Add Prisma schema, migration and seed data for Product. Replace in-memory storage. Test create/read/update and restart the app to prove persistence.

### Lab 9: Service and repository boundaries
Move business logic out of resolver. Add service and repository. Unit-test the service without GraphQL and integration-test repository against PostgreSQL.

### Lab 10: Transactional order creation
Create Order and OrderItem. In one transaction, validate product availability, calculate total on server, create order and decrement inventory. Force a failure halfway through and prove rollback.

### Lab 11: N+1 reproduction
Seed at least 50 orders. Resolve customer for each order with naive per-item query. Capture query count and duration. Save evidence in docs/performance-lab.md.

### Lab 12: DataLoader
Implement request-scoped customer loader. Ensure output order matches input keys and missing keys map to null. Re-run Lab 11 and compare query count. Test two tenants/users to prove no cross-request cache leakage.

### Lab 13: Interface and union
Create SearchResult union of Product and User. Return both types and query using inline fragments and __typename. Add a test for each concrete type.

### Lab 14: Custom scalar and money
Implement/choose a DateTime scalar and document timezone behavior. Represent money with integer minor units and currency or decimal-safe type. Test invalid dates and rounding boundaries.

## Week 3 — Security, pagination and client

### Lab 15: JWT authentication
Add login/token validation using a trusted library. Add me query. Test missing, malformed, expired and valid tokens. Never log token contents.

### Lab 16: Object authorization
Create two users and orders. User A attempts to fetch User B's order by ID and through nested fields. Both must be denied. Put policy in a reusable service/policy boundary.

### Lab 17: Role authorization
Add customer/admin roles. Only admin can update inventory. Test anonymous, customer and admin access. Do not trust role values from request arguments.

### Lab 18: Tenant isolation
Create two tenants with overlapping business data. Apply tenant scoping to repository queries and loaders. Attempt cross-tenant access through every operation path.

### Lab 19: Error mapping
Create domain errors for not found, forbidden and invalid state. Map them to safe GraphQL responses. Verify logs retain internal cause/correlation ID while clients do not see SQL or stack traces.

### Lab 20: Offset pagination
Implement first/offset with a hard maximum page size. Test zero, negative, oversized and empty pages. Explain behavior when rows are inserted between requests.

### Lab 21: Cursor pagination
Implement cursor based on stable ordering plus unique tie-breaker. Return edges and pageInfo. Test duplicate timestamps, deleted cursor row, invalid cursor and concurrent inserts.

### Lab 22: Client cache
Use a GraphQL client in a small test UI or script. Fetch product, update it and verify normalized cache behavior. Document cache key and list membership rules.

### Lab 23: Optimistic update
Implement an optimistic product update in a disposable client. Force server failure and verify rollback. Explain why payment/inventory mutations need extra caution.

## Week 4 — Protection, real time and operations

### Lab 24: Query depth and complexity
Configure depth and cost protections using compatible server tooling. Submit deep and broad operations. Verify rejection happens before expensive resolver work.

### Lab 25: Alias and batching abuse
Submit many aliases and repeated expensive fields. Add request limits, rate limits and concurrency controls. Document what each control protects and its limits.

### Lab 26: Persisted operations
Explore persisted/allowlisted operations for a trusted client. Reject unknown operations in the configured mode. Document development versus production behavior and deployment workflow.

### Lab 27: Subscription
Publish order status event and consume it from a client. Authenticate subscriber and verify ownership for every event. Test disconnect and reconnect.

### Lab 28: Multi-instance event design
Explain why in-memory pub/sub fails across replicas. Design broker-backed delivery, event IDs, duplicate handling, backpressure and graceful shutdown. A local implementation is optional if time/tooling is constrained.

### Lab 29: Observability and load test
Add operation-level logs/metrics/traces with sensitive data redacted. Run representative load test. Record environment, concurrency, p50/p95/p99, throughput, error rate and resource use.

### Lab 30: Release rehearsal
Start from a clean clone. Run dependencies, migrations, seeds, tests and server. Demonstrate auth, order creation, DataLoader evidence, pagination, cost rejection and subscription. Complete production checklist and write a runbook.

## Evidence template
For every lab, add a section to your learning log with:
- Requirement and operation document.
- Schema/resolver/service/repository files changed.
- Tests and commands executed.
- Expected versus actual result.
- Query count/latency when relevant.
- Security and failure cases tested.
- What you learned and remaining questions.

## Completion standard
A lab is not complete if it only returns the expected happy-path JSON. You must test failure and boundary behavior, understand the data-access path and explain the production consequence.
