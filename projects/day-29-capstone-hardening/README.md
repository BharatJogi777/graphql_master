# Day 29 — Capstone Production Hardening

## Goal
Make configuration fail fast, sanitize errors and define security/operational boundaries before release.

## Run
```bash
npm install
npm test
npm run typecheck
```

## Study
- Validate environment variables at process startup.
- Production secrets must meet strength requirements and never be logged.
- CORS should be an explicit origin allowlist.
- Public GraphQL errors should expose stable codes, not internal exception messages.
- Security controls include auth, object/tenant authorization, query budgets, rate limits and request size limits.

## Practice
1. Add JWT issuer/audience config and validate them at startup.
2. Add per-user and per-IP rate limiting.
3. Add persisted operation allowlisting for trusted clients.
4. Add dependency scanning, SBOM and secret scanning to release checks.
5. Write incident runbooks for database outage, broker outage and elevated GraphQL error rate.

## Release gate
Do not ship until database migrations, rollback, backups/restore, alerting, trace correlation, secret rotation, authorization tests, query-cost limits and load tests have been reviewed.

## Production note
This lab validates configuration and sanitizes error output; it is not a complete security certification. Perform threat modeling and test every resolver/data-access path.
