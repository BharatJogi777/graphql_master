# Code Review and Verification Status

> Status: static review and corrective pass in progress. This document is not a claim that all projects have passed runtime validation.

## Scope reviewed

The review has examined the root curriculum structure, the 30 canonical daily project folders, their package manifests and test entry points, selected implementation and test files across the daily labs, and the shared NestJS/Prisma/PostgreSQL capstone.

## Corrective changes made

- Capstone GraphQL money fields now serialize Prisma `BigInt` values on nested DataLoader paths (`Customer → Orders → Order Items → Product`), not only top-level service paths. Regression coverage was added.
- Capstone Prisma relations now describe the tenant-composite foreign keys used by the SQL migration. Currency column types were aligned with the Prisma schema.
- Capstone container execution now uses a non-root runtime image. Database migrations run in a separate one-shot Compose service before the API starts; the API image no longer runs migrations on every process startup.
- Day 8 validates product prices against the PostgreSQL `Int` range.
- Day 9 validates the order total against the database `Int` range and rejects reusing an idempotency key with a different order payload.
- Day 22 live event listeners are tenant-scoped, matching the existing tenant-scoped replay behavior. A cross-tenant delivery regression test was added.
- Day 23 now has a runnable demonstration entry point, and the Day 21/23 README commands explicitly invoke their `run` scripts.
- Day 25 graceful shutdown drains the HTTP listener before stopping Apollo. Its HTTP test waits for the listener to become ready before probing it.
- Day 28 parses SDL into GraphQL documents and supplies subgraph URLs to composition.
- Day 29 always sanitizes `INTERNAL_SERVER_ERROR` messages, including when they arrive as a GraphQLError with that explicit code.
- Day 30 enforces its request-body limit while reading the stream, validates cursors, checks idempotency-key payload consistency, and has a conventional `npm start` script.

## Verification that remains required

The following commands have **not** been executed in a clean local environment as part of this review:

- Install dependencies for all independent daily projects.
- Run each project's test suite and TypeScript typecheck.
- Run Prisma schema validation, migration drift checks and PostgreSQL integration tests.
- Build and run both Docker images/Compose stacks.
- Validate Kubernetes manifests with `kubectl` and the target cluster's policy.
- Exercise Apollo Federation composition and subgraph behavior against the installed package versions.

A GitHub source review cannot substitute for these runtime checks. No claim is made that the full suite passes.

## Intentional learning-lab boundaries

Several projects intentionally use in-memory data or simplified infrastructure to isolate a concept. In particular, the Day 13 bearer token is a demo identity mapping; Day 21 PubSub is in-process and is not a WebSocket transport; Day 22 replay history is in-memory; Day 24 telemetry is not OpenTelemetry; Day 26 manifests are a baseline; and Day 30 trusts a demo tenant header and uses in-memory persistence. Their READMEs describe production work still required.

## Release gate

Do not describe this repository or the shared capstone as production-ready until the verification list above is completed and the remaining authentication, authorization, query-cost, rate-limit, durable messaging, observability, load, and recovery requirements are implemented and tested.
