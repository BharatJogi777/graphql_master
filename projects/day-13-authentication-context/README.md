# Day 13 — Authentication and GraphQL Context

## Goal
Authenticate an HTTP request once and make its principal available to every resolver through request context.

## Run
```bash
npm install
npm test
npm run typecheck
npm run
```

## Study
- Authentication establishes who the caller is; authorization decides what they may do.
- Parse credentials at the transport boundary and construct one context object per request.
- Do not authenticate independently inside every resolver.
- Return stable error codes such as `UNAUTHENTICATED`.
- A GraphQL operation can request public and protected fields together; field-level errors can coexist with partial data.

## Practice
1. Replace the demo token lookup with JWT verification using a trusted issuer and audience.
2. Add expiry and revoked-token cases.
3. Attach a correlation ID and authenticated principal to request context.
4. Ensure subscriptions authenticate at connection setup and re-check permissions for sensitive events.

## Security warning
The token lookup in this lab is deliberately not JWT security. Never accept an unsigned token or decode a JWT without verifying its signature, issuer, audience and expiry. Keep secrets outside source control.
