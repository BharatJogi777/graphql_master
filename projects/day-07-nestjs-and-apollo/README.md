# Day 07 — NestJS and Apollo GraphQL

## Goal
Build a GraphQL HTTP server using NestJS code-first decorators and Apollo Server.

## Run
```bash
npm install
npm test
npm run typecheck
npm run start:dev
```
Open `http://localhost:3000/graphql` and run:
```graphql
query Catalog {
  hello
  products { id name priceMinor }
  product(id: "p-1") { name }
}
```

Set `PORT=4000` to change the HTTP port.

## Study
- `@ObjectType` and `@Field` define the GraphQL schema from TypeScript classes.
- `@Resolver` groups field resolvers.
- `@Query` exposes a read operation; `@Args` maps GraphQL arguments.
- `GraphQLModule` configures the Apollo driver and generated schema.
- Nest dependency injection manages resolver providers.

## Practice
1. Add a ProductStatus enum and expose it on Product.
2. Add a mutation with a dedicated `@InputType`.
3. Move the in-memory catalog into a `ProductsService` and inject it.
4. Add an e2e test that sends an HTTP GraphQL request to `/graphql`.

## Production note
This is an educational in-memory server. Before production, add configuration validation, auth/context, input validation, rate limits, query complexity limits, structured logging and a persistence layer.
