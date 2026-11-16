
# 04 — Schema Design and Evolution

## Design from use cases, not database tables
Start from client use cases and domain language. A DB row is not automatically a public GraphQL type. Keep persistence models behind services and repositories.

~~~~graphql
type User {
  id: ID!
  displayName: String!
  orders(first: Int!, after: String): OrderConnection!
}
type Order {
  id: ID!
  status: OrderStatus!
  total: Money!
  createdAt: DateTime!
}
enum OrderStatus { PENDING PAID FULFILLED CANCELLED }
~~~~

## Scalars and custom scalars
Built-ins: Int, Float, String, Boolean and ID. ID is an identifier scalar, not a promise of integer storage. Define custom scalars only for reusable semantics. DateTime should validate input and normalize timezone behavior. Money must avoid binary floating-point rounding; use integer minor units or a decimal-safe representation with currency.

## Input and output types
Input objects are for arguments; object types are returned. GraphQL does not allow output object types to be reused as input types. Keep mutation input separate. Define patch semantics: decide whether omitted means unchanged and null means clear; test both.

## Nullability
Non-null is a promise to clients. If a resolver returns null for a non-null field, GraphQL raises an execution error and propagates null to the nearest nullable parent. Do not mark every field non-null by habit. Consider data availability, authorization, downstream failures and migration constraints.

Exercise: create four fields with different list/null wrappers; return null at each level and record where null propagates.

## Interfaces and unions
Use an interface when types share a common field contract. Use a union when a field may return one of several object types without shared fields. Clients can use inline fragments and __typename.

~~~~graphql
interface Node { id: ID! }
type User implements Node { id: ID!, displayName: String! }
type Product implements Node { id: ID!, name: String! }
union SearchResult = User | Product
~~~~

## Filtering and sorting
Use explicit bounded filter/sort inputs. Define allowed fields and deterministic ordering. Never accept arbitrary SQL fragments, column names or ORM expressions from clients. Validate ranges and cap page sizes.

## Schema evolution
- Additive fields are usually compatible, but generated exhaustive enum handling can still be affected by new enum values.
- Do not remove or rename fields in place.
- Deprecate with a reason, measure usage, communicate migration and remove through a controlled process.
- Changing nullability can break clients.
- Add schema checks and representative operation tests.

## Exercises
1. Design Product, Inventory, Order, OrderItem, User and Payment types.
2. Add filters and sorting with max page size.
3. Define a search union.
4. Define DateTime and money representations.
5. Deprecate a field and write a migration note.
6. Ask a client developer to use the schema without reading server code.

Acceptance: schema changes are deliberate, documented and backward-compatible wherever possible.
