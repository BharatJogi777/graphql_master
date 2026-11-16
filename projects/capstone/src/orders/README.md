# Order relationships and nested resolvers

The order graph demonstrates four relations:

- `Customer.orders`: one-to-many.
- `Order.customer`: many-to-one.
- `Order.items`: one-to-many.
- `OrderItem.product`: many-to-one.

The relation resolvers use request-scoped DataLoaders. The batch functions query each relation with a single `IN (...)` filter, group rows by their parent key, and return values in exactly the same order as the input keys.

## Query

```graphql
query OrderDetails($id: ID!) {
  order(id: $id) {
    id
    status
    totalMinor
    customer { id name email }
    items {
      quantity
      unitPriceMinor
      product { id sku name }
    }
  }
}
```

## Why request-scoped matters

A loader's memoization cache is useful inside one GraphQL operation, but a process-wide loader can leak cached records across users or tenants. A fresh loader collection is created for each GraphQL request. The current tenant comes from the server-owned demo scope and must be replaced by the verified JWT principal in the authentication milestone.

## N+1 comparison

Without DataLoader, resolving 40 orders and then each order's customer can issue 1 order query + 40 customer queries. With DataLoader, the same field fan-out is typically 1 order query + 1 batched customer query. Nested items and products are batched similarly.

Run `npm test -- --runInBand` and inspect the loader tests to verify batching, key-order preservation, missing-parent behavior, tenant scoping, and request cache isolation.
