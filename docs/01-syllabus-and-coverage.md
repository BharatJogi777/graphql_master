
# 01 — Complete Syllabus and Coverage Checklist

Check an item only after implementing and testing it.

## A. Foundations and protocol
- [ ] Why GraphQL; strengths, limitations and REST comparison
- [ ] GraphQL specification and schema as contract
- [ ] HTTP transport, JSON request/response, GET/POST conventions
- [ ] Document, operation, selection set, field, argument, alias, fragment, variable
- [ ] Query, mutation and subscription
- [ ] SDL, schema construction and introspection
- [ ] Validation versus execution; variable coercion
- [ ] Partial data, errors, paths and locations

## B. Type system and schema design
- [ ] Built-in scalars: Int, Float, String, Boolean, ID
- [ ] Object types, fields, arguments and descriptions
- [ ] Enums, input objects, lists and non-null wrappers
- [ ] Null bubbling and nullable boundaries
- [ ] Interfaces, unions and __typename
- [ ] Custom scalars: DateTime, URL and decimal-safe money design
- [ ] Input/output type separation and patch semantics
- [ ] Naming, domain boundaries, filters and sorting
- [ ] Deprecation, compatibility and schema evolution

## C. Execution and server
- [ ] Resolver signature: parent/source, args, context, info
- [ ] Root and nested resolver traversal
- [ ] Default field resolver
- [ ] Async resolvers and execution behavior
- [ ] Request-scoped context and dependencies
- [ ] NestJS dependency injection
- [ ] Error mapping and partial response behavior
- [ ] Directives, guards, interceptors and middleware integration
- [ ] Custom validation and scalar parsing/serialization
- [ ] File upload strategy and transport limits where required

## D. Data access and performance
- [ ] Resolver → service → repository boundaries
- [ ] SQL joins, projections and bounded data access
- [ ] N+1 reproduction and query-count measurement
- [ ] DataLoader batching, ordering, missing keys and request scope
- [ ] Relation batching and transaction consistency
- [ ] Offset versus cursor pagination
- [ ] Relay connections: edges, node, cursor and pageInfo
- [ ] Indexes and query plans
- [ ] Request/application/client/HTTP caching and invalidation
- [ ] Query depth, complexity/cost, alias and batching abuse
- [ ] Persisted/allowlisted operations, response limits and rate limits
- [ ] Concurrency limits, timeouts and cancellation

## E. Identity, authorization and security
- [ ] Authentication versus authorization
- [ ] JWT/session verification and request context
- [ ] Role-based, attribute-based and object-level checks
- [ ] Field-level, resource-level and tenant isolation
- [ ] IDOR prevention through every resolver path
- [ ] Input validation and SQL injection prevention
- [ ] Introspection and IDE exposure policy
- [ ] CSRF/CORS/cookie considerations
- [ ] Error leakage, log redaction and secrets
- [ ] Denial-of-service and query abuse controls

## F. Client, pagination and real time
- [ ] Client request lifecycle, operation documents and variables
- [ ] Generated TypeScript types
- [ ] Normalized cache identity and mutation updates
- [ ] Optimistic updates and rollback
- [ ] Cursor pagination behavior
- [ ] Subscription transport, authentication and authorization
- [ ] Pub/sub, reconnect, duplicates, ordering and backpressure
- [ ] Polling, webhooks and SSE alternatives

## G. Quality, operations and architecture
- [ ] Unit, resolver, operation, integration, E2E and contract tests
- [ ] Authorization negative tests and schema checks
- [ ] Load/soak tests
- [ ] Structured logs, metrics and distributed tracing
- [ ] Resolver latency, DB query and DataLoader telemetry
- [ ] Health/readiness, graceful shutdown and resource cleanup
- [ ] Docker, migrations, CI and rollback
- [ ] Monolith versus BFF/gateway
- [ ] Federation: subgraphs, entities, keys, router and composition
- [ ] Distributed failure modes, ownership and observability
- [ ] Schema stitching as an alternative and its trade-offs
- [ ] GraphQL over HTTP and relevant specification updates

## H. Capstone proof
- [ ] Requirements, schema decisions and architecture diagram
- [ ] Running app, migrations and seed data
- [ ] Authenticated and public operations
- [ ] DataLoader query-count proof
- [ ] Cursor pagination and cost protections
- [ ] Success, failure and security tests
- [ ] Logs, metrics and traces
- [ ] Docker setup, deployment guide and runbook
- [ ] Load-test report and known limitations

## Advanced/vendor-specific follow-up
Explore as required: advanced Federation composition, router plugins, schema registry/checks, persisted-operation pipelines, Relay conventions, live queries, defer/stream incremental delivery, custom transports and multi-region subscriptions. Distinguish specification features from vendor-specific implementations.
