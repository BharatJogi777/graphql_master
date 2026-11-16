
# 08 — Authentication, Authorization and Security

## Authentication versus authorization
Authentication asks who is making the request. Authorization asks whether that principal may perform this action on this resource/field. A valid JWT does not grant access to every object.

## Request identity
Verify signature, issuer, audience, expiry and relevant claims with a trusted library and configured keys. Put a verified principal in request context. Never trust client-supplied role, tenant ID or owner ID. With cookies, design CSRF protection and SameSite/Secure/HttpOnly behavior. With bearer tokens, use TLS and never log tokens.

## Authorization layers
- Operation/route-level permission.
- Field-level permission.
- Object-level permission (this order belongs to this customer).
- Tenant-level permission.
- Business-rule permission (is this transition allowed now?).

Centralize policy logic in reusable guards/policies/services. UI field hiding is not authorization.

## Common pitfalls
- IDOR: changing an ID reveals another user's record.
- Nested resolver bypass: root query checks ownership but nested path does not.
- Tenant leakage through global DataLoader/cache.
- Deep/broad query denial of service.
- Alias batching amplifies expensive operations.
- Large bodies, expensive scalars and unbounded lists.
- Errors reveal SQL, stack traces or sensitive record existence.
- Introspection/GraphiQL exposed without policy.
- Cookie auth without CSRF design.
- Unsafe uploads and unbounded external fetches.

## Defense in depth
Apply authn, authz, input validation, depth and complexity/cost controls, max page sizes, request body limits, rate/concurrency limits, timeouts, safe errors and observability. Persisted/allowlisted operations may help trusted clients. Introspection policy is not a substitute for authorization. Depth alone is insufficient: shallow queries can have many aliases or expensive fields.

## Exercises
1. Add JWT authentication and me query.
2. Add admin-only inventory mutation.
3. Ensure users can only read their orders by ID and through nested relations.
4. Add two tenants and prove cross-tenant access is denied.
5. Test every path to the same object.
6. Send deep, broad, aliased and oversized operations; confirm safe rejection.
7. Verify logs contain request IDs but no credentials/sensitive payloads.

Acceptance: negative authorization tests are as comprehensive as happy paths; every resolver path respects object and tenant policy.
