# Product GraphQL API

This module demonstrates code-first GraphQL types, validated input objects, resolver-to-service separation, Prisma access, and safe money serialization.

## Operations

```graphql
query {
  productsList { id sku name priceMinor currency status }
}
```

```graphql
query ProductById($id: ID!) {
  product(id: $id) { id name priceMinor }
}
```

```graphql
mutation CreateProduct($input: CreateProductInput!) {
  createProduct(input: $input) { id sku name priceMinor status }
}
```

Variables:

```json
{
  "input": {
    "sku": "SKU-100",
    "name": "Wireless Keyboard",
    "description": "Compact keyboard",
    "priceMinor": "249900",
    "currency": "INR",
    "status": "ACTIVE"
  }
}
```

Other mutations: `updateProduct(id, input)`, `deleteProduct(id)`.

## Important decisions

- Price is sent as a decimal-free integer string (minor currency units). It is converted to JavaScript `bigint` only at the persistence boundary and serialized back to a string.
- Every read/update/delete filters by tenant ID. The current constant is a deliberately temporary demo tenant scope; JWT-derived scope is a later milestone.
- Unique SKU violations return a conflict; products referenced by order items cannot be deleted.
- Resolver classes contain transport mapping only. Business and persistence behavior belongs in the service.
