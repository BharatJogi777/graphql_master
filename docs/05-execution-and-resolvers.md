
# 05 — Execution and Resolvers

## Resolver mental model
A resolver supplies a value for a schema field. Conceptually its arguments are:
~~~~ts
(parent, args, context, info) => value | Promise<value>
~~~~
- parent/source: value returned by the parent field.
- args: validated/coerced field arguments.
- context: request-scoped identity, loaders and metadata.
- info: execution metadata such as field name, path and schema.

Framework decorators may hide this signature; the concepts remain.

## Nested resolution
For product { category { name } }, Query.product returns a product. Product.category receives that product as parent and resolves its category. A default field resolver may read a matching property from parent. Use explicit resolvers when loading, authorization or transformation is required.

## Keep layers separated
GraphQL resolver → application service → repository/data access → database/external service.
Resolvers adapt GraphQL inputs/outputs. Services enforce domain rules and transactions. Repositories own persistence. This keeps logic reusable from jobs, REST endpoints and tests.

## Context lifecycle
Build context per request. Put verified identity, request-scoped DataLoaders and correlation metadata there. Never put mutable user-specific state in a process-global singleton. A client-supplied user ID is not proof of identity.

## Execution and errors
- Parse/validation/coercion errors: operation cannot execute.
- Execution errors: resolver/completion fails; response may contain partial data.
- Domain outcomes: insufficient stock or invalid state can be modeled as typed results or controlled errors according to API conventions.

Do not leak SQL, stack traces, secrets or raw internal service responses. Preserve correlation IDs in logs. Be deliberate about nullable boundaries.

## Exercises
1. Implement Query.product and Query.products.
2. Implement Product.category using parent.
3. Add resolver using args and another using current user from context.
4. Inspect info for field name/path; avoid brittle selection-set parsing for correctness.
5. Fail a nested resolver and inspect partial data/error path.
6. Move business rules to a service and unit-test independently.
7. Verify concurrent requests do not share context or loaders.

Acceptance: explain parent/args/context/info, traversal, default resolution, partial errors and request-scoped context.
