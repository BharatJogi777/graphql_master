
# 12 — Capstone: Production-Style Commerce and Order Graph

## Goal
Build a GraphQL backend for a small commerce platform demonstrating schema design, business rules, persistence, authorization, performance, testing and operations. Use a payment sandbox/mock provider; this is not a payment-certified system.

## Functional scope

### Identity
Register/login or integrate a documented identity provider; me query; customer/support/admin roles; tenant/account boundary if using multi-tenancy.

### Catalog and inventory
Product list/detail/search; bounded filters/sorting; inventory availability; admin product and inventory mutations.

### Orders
Create order from product IDs and quantities; calculate totals on server; validate inventory and create order atomically; order list/detail with cursor pagination; customer ownership and support/admin policies; controlled state transitions.

### Real time
Order status subscription with ownership checks. Use local broker for development and document scalable multi-replica broker design.

## Schema starting point
~~~~graphql
type Query {
  me: User
  product(id: ID!): Product
  products(first: Int = 20, after: String, filter: ProductFilter): ProductConnection!
  order(id: ID!): Order
  myOrders(first: Int = 20, after: String): OrderConnection!
}
type Mutation {
  createOrder(input: CreateOrderInput!): CreateOrderPayload!
  updateProduct(input: UpdateProductInput!): Product!
  updateInventory(input: UpdateInventoryInput!): Inventory!
}
type Subscription {
  orderStatusChanged(orderId: ID!): Order!
}
~~~~
This is a starting contract, not a final schema. Add enums, inputs, connections, payloads, error semantics and domain fields.

## Non-functional requirements
Input validation; safe errors; authentication and object/tenant authorization; DataLoader; bounded pagination and query-cost controls; indexes and transactions; structured logs/metrics/traces; unit/integration/E2E tests; Docker Compose; migrations/seeds; graceful shutdown; readiness/health; security and operations docs.

## Data model
User, Product, Inventory, Order, OrderItem, PaymentAttempt (sandbox only), OutboxEvent. Define constraints, foreign keys, indexes and transaction boundaries. Use integer minor units or decimal-safe money with currency, never floating-point financial arithmetic.

## Deliverables
1. Architecture diagram and assumptions.
2. Schema docs and evolution policy.
3. Running service and migrations.
4. Seed data and example operations/variables.
5. Tests for happy paths, validation, auth, tenant isolation and failures.
6. DataLoader before/after query-count report.
7. Pagination consistency tests.
8. Query-cost/security tests.
9. Load-test report with workload/environment.
10. Logs/metrics/traces evidence.
11. Docker setup, deployment guide, environment variable reference and runbook.
12. Known limitations and future improvements.

## Acceptance scenarios
- Anonymous user cannot access private order data.
- Customer A cannot fetch Customer B's order by guessing ID.
- Nested resolver cannot bypass ownership.
- Customer cannot modify inventory.
- Order total is calculated by server.
- Insufficient stock leaves no partial order.
- 50 orders with customer fields do not cause 51 DB round trips.
- Pagination ordering is stable in defined tests.
- Expensive/oversized operations are rejected.
- Subscription cannot leak another customer's events.
- DB outage returns safe client errors and useful telemetry.
- New developer can run the project from documented instructions.

## Demo script
Start from clean checkout; authenticate; query me; browse products with cursor pagination; create order; subscribe to status; demonstrate cross-user denial; show DataLoader evidence; trigger cost rejection; run tests/load test; explain trade-offs.
