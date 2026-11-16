# Day 14 — Authorization, Ownership and Tenant Isolation

## Goal
Enforce access control at the data boundary and prevent cross-tenant object leakage.

## Run
```bash
npm install
npm test
npm run typecheck
npm run
```

## Study
- Authentication alone is insufficient: every resolver/data access needs an authorization policy.
- List queries must be tenant-filtered in the database query, not filtered after returning all rows.
- Object lookups should include tenant scope in the lookup predicate.
- Admin access is explicit; it is not an accidental bypass.
- Returning null for inaccessible objects can avoid confirming their existence, depending on the API's threat model.

## Practice
1. Add a service layer and move policy checks out of resolver functions.
2. Enforce tenant scoping in Prisma `where` clauses.
3. Add field-level permission for the Project.secret field.
4. Test IDOR attempts by changing object IDs across tenants.
5. Add audit events for denied access without logging secrets.

## Production note
Never trust a tenant ID supplied by the client. Derive it from the authenticated principal. Add database constraints and query scoping so a forgotten resolver check cannot expose another tenant's rows.
