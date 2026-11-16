# Day 21 — GraphQL Subscriptions

## Goal
Understand subscription operations as long-lived streams of execution results.

## Run
```bash
npm install
npm test
npm run typecheck
npm run
```

## Study
- A subscription has a source event stream and a field resolver for each event.
- GraphQL executes the selection set for every published event.
- Subscription filters must be enforced server-side.
- Every subscription must clean up listeners when the client disconnects.
- In-memory PubSub works only within one process.

## Practice
1. Add an authenticated subscription and tenant filter.
2. Add a maximum active subscription count per principal.
3. Add event payload validation before publishing.
4. Implement heartbeat and connection cleanup at the transport layer.
5. Replace in-memory PubSub with Redis or a durable broker for multi-instance deployment.

## Production note
This is an in-process teaching implementation, not a WebSocket server. For production, choose a supported GraphQL transport, authenticate connections, enforce authorization on events, handle disconnects, backpressure, horizontal fan-out and broker outages.
