
# 15 — Glossary and Official References

## Glossary
- Schema: typed contract describing available operations and fields.
- SDL: Schema Definition Language.
- Operation: query, mutation or subscription document.
- Resolver: function supplying a field value.
- Root type: Query, Mutation or Subscription entry point.
- Context: per-request shared execution data.
- Introspection: querying schema type/field metadata.
- Null bubbling: propagation caused by null for a non-null field.
- N+1: one collection query followed by one query per item.
- DataLoader: batching and memoization utility commonly used to reduce N+1.
- Cursor: opaque pagination position.
- Connection: pagination shape with edges and pageInfo.
- Persisted operation: operation registered or identified before execution.
- Query cost: estimate of resource expense for an operation.
- Federation: ecosystem for composing independently owned subgraphs.
- Subgraph: GraphQL service contributing part of a federated graph.
- Entity: object resolvable across subgraphs in a federation implementation.
- BFF: Backend For Frontend, an API tailored to a client experience.

## Official references
Use primary docs and verify the version matching your dependencies.
- GraphQL learn: https://graphql.org/learn/
- GraphQL specification: https://spec.graphql.org/
- GraphQL over HTTP resources: https://github.com/graphql/graphql-over-http
- NestJS GraphQL: https://docs.nestjs.com/graphql/quick-start
- Apollo Server: https://www.apollographql.com/docs/apollo-server/
- Apollo Federation: https://www.apollographql.com/docs/federation/
- DataLoader: https://github.com/graphql/dataloader
- GraphQL Code Generator: https://the-guild.dev/graphql/codegen
- Prisma: https://www.prisma.io/docs
- PostgreSQL: https://www.postgresql.org/docs/
- Jest: https://jestjs.io/docs/getting-started
- OWASP Cheat Sheet Series: https://cheatsheetseries.owasp.org/

## Verify online examples
1. Identify package and major version.
2. Check official docs for that version.
3. Confirm API is not deprecated.
4. Run the smallest example in a clean branch.
5. Add a test before integrating it.
6. Record version and link in your learning log.

Do not conflate GraphQL specification features, Apollo-specific features, NestJS decorators and client-library behavior.
