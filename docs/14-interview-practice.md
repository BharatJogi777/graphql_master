
# 14 — GraphQL Interview Practice

Answer aloud before reading the expected points. Aim for a clear 60–120 second answer and support it with capstone code/tests.

## Fundamentals
1. What is GraphQL? Typed schema, client-selected fields, validation/execution; not a DB or automatic optimizer.
2. GraphQL versus REST? Compare endpoint/resource model, caching, observability, flexibility, complexity and governance.
3. Request lifecycle? Parse, validate, coerce variables, execute resolvers, complete values, return data/errors.
4. Query/mutation/subscription? Read, write with serial top-level mutation fields, event stream; transport is separate.
5. Null bubbling? Non-null completion violation propagates to nearest nullable ancestor and records error.

## Schema and execution
6. Scalar, enum, input, object, interface and union?
7. Explain [User], [User!], [User]! and [User!]!.
8. What are parent, args, context and info?
9. What is default field resolver?
10. How do fragments, aliases and variables work?
11. How evolve schema safely?
12. Why separate input and output types?

## Performance
13. Explain N+1 with example.
14. How does DataLoader batch/cache?
15. Why are loaders usually request-scoped?
16. Offset versus cursor pagination?
17. How measure resolver/database performance?
18. Why is GraphQL not automatically faster than REST?
19. How design query complexity/cost limits?

## Security
20. How implement authentication?
21. Why is authentication not authorization?
22. How prevent IDOR through nested resolvers?
23. How prevent cross-tenant cache leakage?
24. How defend against deep, broad and aliased queries?
25. Should introspection always be disabled? Explain the real security boundary.

## Architecture and operations
26. When use GraphQL BFF?
27. When use Federation?
28. Explain subgraphs, entities and keys.
29. What if one subgraph is slow/unavailable?
30. How test GraphQL E2E?
31. What should be logged/measured?
32. How do subscriptions work across replicas?
33. How deploy schema changes safely?

## Scenario exercises
A. 100 products each with seller and inventory: explain N+1, batching, SQL joins, auth and measurement.
B. Customer can read another customer's order by changing ID: find every access path, enforce object policy and tenant scoping, write negative tests.
C. Latency rises after new client query: inspect operation cost, aliases, list multipliers, traces, batches, SQL plans and downstream calls; mitigate and add regression tests.
D. Team wants Federation immediately: assess independent ownership, deployments, client needs, team boundaries and operational readiness; compare modular monolith/BFF.
E. Order is created but inventory decrement fails: use transaction or distributed consistency pattern; define idempotency and side effects. Mutation serialization does not make DB writes atomic.

## Final interview bar
Explain capstone architecture, show N+1 and authorization tests, present performance measurements, describe a production failure mode and defend architecture choices.
