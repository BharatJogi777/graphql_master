
# 11 — Advanced Architecture: Federation, Gateways and Distributed Graphs

## Start simple
A single GraphQL service (often a BFF) backed by modular domain services is easier to build and operate than a federated graph. Do not introduce Federation merely because the backend uses microservices.

## Gateway/BFF
A gateway can provide one client-facing API while delegating to REST, gRPC or GraphQL services. It centralizes composition but adds network hops, failure aggregation, auth propagation, observability and ownership concerns.

## Federation concepts
Apollo Federation is an implementation ecosystem for composing independently owned subgraphs. Learn subgraph schemas and ownership boundaries; router role; entity identity and keys; references and cross-subgraph fields; composition errors; query planning; auth/context propagation; timeouts/retries/partial failures; schema rollout and ownership governance.

Federation is not part of the core GraphQL specification. Label vendor-specific behavior accurately.

## Failure modes
One client operation can fan out to multiple services. A slow subgraph can dominate latency; retries can amplify load; partial failures can confuse clients; shared entity fields can blur ownership. Define budgets, timeouts, retry policy, circuit breaking, fallback and distributed tracing.

## Schema stitching
Understand stitching as an alternative approach to combining schemas. Compare ownership, delegation, tooling and operations with Federation; they are not synonyms.

## Architecture exercise
Draw three designs for commerce:
1. Modular monolith with one GraphQL service.
2. GraphQL BFF calling existing REST services.
3. Federated graph with Users, Catalog and Orders subgraphs.

For each document ownership, network hops, deployment coupling, failure modes, latency, observability, local development and operating cost. Choose one and justify why others are not yet warranted.

## Federation lab
If time and compatible tooling allow, build Catalog and Orders subgraphs, compose them with a router, resolve an entity across boundaries and test a subgraph outage. Pin compatible versions and follow current docs.

Acceptance: explain entity resolution, composition, query planning and failure propagation; justify when not to federate.
