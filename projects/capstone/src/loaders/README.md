# Request-scoped DataLoader

DataLoader solves the resolver N+1 pattern by collecting keys during one event-loop turn, issuing a batched query, and restoring results to the original key order.

This API creates four loaders per GraphQL request:

- `customerById`: batch customer lookups for `Order.customer`.
- `productById`: batch product lookups for `OrderItem.product`.
- `ordersByCustomerId`: batch one-to-many customer order lookups.
- `orderItemsByOrderId`: batch one-to-many order item lookups.

All batch functions apply the server-selected tenant ID. The context factory constructs a new loader set for every operation; do not move these loaders to module or process scope because their cache is request-local by design.

Try:

```graphql
query {
  customersList {
    id
    name
    orders {
      id
      status
      items {
        quantity
        product { sku name }
      }
    }
  }
}
```

Inspect `loaders.spec.ts` for batching, result ordering, empty relationships, tenant filtering, and cache isolation.
