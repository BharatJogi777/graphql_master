# Customer GraphQL API

The customer API is backed by the tenant-scoped `User` model. It exposes list/detail queries and create/update/delete mutations.

```graphql
query {
  customersList { id email name role createdAt }
}
```

```graphql
mutation CreateCustomer($input: CreateCustomerInput!) {
  createCustomer(input: $input) { id email name role }
}
```

Variables:

```json
{
  "input": {
    "email": "customer@example.com",
    "name": "Example Customer",
    "role": "CUSTOMER"
  }
}
```

Other mutations: `updateCustomer(id, input)`, `deleteCustomer(id)`.

Email is normalized to lowercase. Tenant scope is server-owned and temporary for this learning milestone; authentication and authorization replace it in a later phase. Customers referenced by orders cannot be deleted.
