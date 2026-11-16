# Day 25 — Dockerized GraphQL Deployment

## Goal
Package a GraphQL API with a multi-stage Docker build, non-root runtime and health checks.

## Run locally
```bash
npm install
npm test
npm run typecheck
npm run dev
```

## Run in Docker
```bash
docker compose up --build
```
GraphQL endpoint: `http://localhost:4000/graphql`. Liveness and readiness: `/health/live` and `/health/ready`.

## Study
- Multi-stage builds keep compilers and dev dependencies out of the runtime image.
- A non-root user reduces container privileges.
- Health checks let an orchestrator detect unhealthy containers.
- Graceful shutdown should stop accepting traffic and drain in-flight work.
- Configuration and secrets should be injected at runtime.

## Practice
1. Add a database and make readiness depend on a real DB ping.
2. Add a container image scan and an SBOM generation step.
3. Pin base image digests and use lockfile-based npm ci.
4. Add request body limits, compression policy and HTTP server timeouts.
5. Run the image as read-only with a writable temporary directory only where needed.

## Production note
The example uses npm install to keep the exercise self-contained. In production commit a lockfile and use `npm ci`; pin image digests, scan images, inject secrets from a secret manager and verify readiness against dependencies.
