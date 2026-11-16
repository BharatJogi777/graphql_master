# 18 — Completion Evidence and Verification Matrix

Use this file to prevent a folder or a written explanation from being mistaken for a working implementation.

## Evidence required for each lab
- [ ] Code exists and is committed.
- [ ] Dependencies and supported runtime versions are declared.
- [ ] Exact setup and run commands are documented.
- [ ] Type-check/lint command is documented and passes locally.
- [ ] Automated tests cover success, validation, authorization and failure behavior relevant to the lab.
- [ ] Integration tests use the real boundary where appropriate (database, broker, HTTP transport).
- [ ] Security/performance implications are addressed where relevant.
- [ ] Known limitations and trade-offs are recorded.
- [ ] Learner can explain the implementation without copying the README.

## Repository status at curriculum initialization
- Day 1: runnable Apollo Server starter code and test file are present. Test execution must still be verified on the learner's machine.
- Days 2–30: learning-lab README scaffolds are present; implementations are intentionally pending.
- Curriculum docs: foundations, schema, resolvers, NestJS, data access, security, clients, testing, architecture, capstone and readiness topics are documented.
- No CI workflow is included by design. Local verification commands remain required.

## Release gates
### Gate A — Fundamentals (Days 1–6)
Demonstrate schema parsing/validation, operation execution, variables, resolver traversal, nullability and error behavior with tests.

### Gate B — Backend implementation (Days 7–15)
Run NestJS with PostgreSQL/Prisma; prove transaction boundaries, DataLoader query reduction, authentication, object authorization and tenant isolation.

### Gate C — Client and runtime behavior (Days 16–26)
Prove bounded pagination, caching/invalidation, query-cost protections, client typing, subscription reliability, tests, telemetry and container deployment.

### Gate D — Architecture and capstone (Days 27–30)
Present architecture decisions, Federation trade-offs, load/security evidence, deployment/rollback runbook and a working end-to-end demonstration.

## Definition of done
A topic is complete only when you can implement it, test normal and failure paths, explain its trade-offs and diagnose a realistic failure. A committed scaffold or a passing unit test alone is not production readiness.
