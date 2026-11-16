# Day 22 — Subscription Reliability, Replay and Multi-Tenant Events

## Goal
Design event delivery that can recover from disconnects without leaking events across tenants.

## Run
```bash
npm install
npm test
npm run typecheck
```

## Study
- A reconnecting client needs a resume cursor/last event ID.
- Replay windows must be bounded; expired cursors require a full resynchronization.
- Event IDs must be monotonic within the stream's ordering contract.
- Tenant filtering must happen before event payloads are delivered.
- In-memory history is not durable across process restarts.

## Practice
1. Persist events in an outbox table in the same transaction as the domain change.
2. Use a broker partition key that preserves per-order or per-tenant ordering.
3. Add event schema versioning and backward-compatible consumers.
4. Test duplicate delivery and make consumers idempotent.
5. Add retention, replay authorization and observability for lag/reconnect rates.

## Production note
This bounded in-memory replay bus demonstrates the contract only. Production replay requires durable storage, retention policy, stable IDs, authorization checks, idempotent clients and a documented resync path.
