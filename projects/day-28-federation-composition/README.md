# Day 28 — Federation Composition and Ownership

## Goal
Compose independently owned Catalog and Inventory subgraphs into one supergraph schema.

## Run
```bash
npm install
npm test
npm run typecheck
```

## Study
- Composition validates whether independently authored subgraphs can form one graph.
- Entity keys connect representations across subgraphs.
- `@external` marks fields referenced but owned elsewhere.
- Field ownership must be explicit; conflicting definitions can make composition fail.
- The gateway/router plans and routes operations using the composed supergraph.

## Practice
1. Add a second key and compare entity resolution behavior.
2. Add an @shareable field only when ownership semantics support it.
3. Add a composition-failure test for conflicting field types.
4. Generate a supergraph artifact in a release pipeline.
5. Compare Apollo Router with a Node gateway in operational footprint and latency.

## Production note
This lab composes schemas but does not start a gateway or router. Production federation needs schema registry/versioning, composition checks, subgraph health, distributed tracing, timeouts and failure policies.
