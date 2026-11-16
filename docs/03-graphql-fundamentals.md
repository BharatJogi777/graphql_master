
# 03 — GraphQL Fundamentals

## What GraphQL is
GraphQL is a typed API query language and execution specification. A server exposes a schema; a client sends an operation describing fields; the server validates and executes it and returns JSON shaped by the selection set. GraphQL is not a database, ORM, transport or automatic performance optimizer.

## REST comparison
REST commonly models resources and multiple endpoints. GraphQL commonly exposes a schema and operations, often over one HTTP endpoint. GraphQL can reduce client round trips and allow nested field selection, but adds schema governance, resolver/data-access complexity, query-cost controls, caching and observability challenges. It is not always faster and does not replace REST in every situation.

## First schema
~~~~graphql
type Product {
  id: ID!
  name: String!
  price: Float!
  inStock: Boolean!
}
type Query {
  product(id: ID!): Product
  products(limit: Int = 20): [Product!]!
}
~~~~

Nullability:
- Product may be null.
- Product! may not be null.
- [Product] list and entries may be null.
- [Product!] list may be null, entries may not.
- [Product!]! neither list nor entries may be null.

## Query and variables
~~~~graphql
query ProductDetails($productId: ID!) {
  product(id: $productId) { id name price }
}
~~~~
Variables JSON: { "productId": "p-100" }. Use variables instead of string-building query documents. Name operations for logs and tracing.

## Aliases and fragments
~~~~graphql
query Compare {
  first: product(id: "p-100") { id name }
  second: product(id: "p-200") { id name }
}
fragment ProductSummary on Product { id name price }
query Catalog { products(limit: 10) { ...ProductSummary } }
~~~~
Aliases rename response keys. Fragments reuse selections. Neither bypasses cost controls.

## Mutations
~~~~graphql
input CreateProductInput {
  name: String!
  price: Float!
}
type Mutation {
  createProduct(input: CreateProductInput!): Product!
}
~~~~
Mutations represent writes. Top-level mutation fields execute serially in one operation, but this does not replace DB transactions or guarantee distributed side-effect ordering.

## Request lifecycle
1. Receive transport request and parse the document.
2. Validate document against schema and rules.
3. Coerce variables and arguments.
4. Execute operation and traverse selected fields.
5. Invoke resolvers and await asynchronous values.
6. Complete values according to output types.
7. Return data and any execution errors.

Parse/validation errors normally prevent execution. Execution errors may coexist with partial data. A null result for a non-null field can propagate null upward to the nearest nullable boundary.

## Exercises
1. Create User, Product and Order types.
2. Write list/detail queries with variables and aliases.
3. Reuse a fragment in two operations.
4. Add create/update mutations with input types.
5. Query an unknown field and record validation error.
6. Make a resolver fail; inspect data, errors, path and null propagation.
7. Explain when REST is still a better choice.

Acceptance: explain lifecycle and nullability precisely; all operations run against your local server.
