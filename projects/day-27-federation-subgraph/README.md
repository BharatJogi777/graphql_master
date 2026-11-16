# Day 27 — Apollo Federation Subgraph

## Goal
Build a federated subgraph that owns Product data and supports entity references.

## Run
```bash
npm install
npm test
npm run typecheck
```

## Study
- A subgraph owns part of the graph and publishes its schema to a supergraph.
- `@key` identifies an entity across subgraphs.
- `__resolveReference` loads an entity by its key when another subgraph extends it.
- A subgraph should own its domain data and avoid duplicating another service's source of truth.
- Federation is a distributed schema composition/runtime model, not simply multiple GraphQL servers.

## Practice
1. Add an Inventory subgraph that extends Product and owns stock quantity.
2. Add tenant-aware entity reference loading.
3. Add entity batching to avoid one database call per representation.
4. Add contract checks for key fields and ownership.
5. Run the subgraph through Apollo Server over HTTP.

## Production note
This is a schema-level subgraph lab, not a deployed subgraph service. Federation adds network hops, ownership coordination and operational complexity. Use it only when independent team/service ownership justifies the cost.
