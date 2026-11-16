/**
 * Temporary learning scope: all unauthenticated requests operate on the seeded demo tenant.
 * Day 13 replaces this with tenant identity derived from a verified JWT principal.
 * Never accept tenantId from GraphQL arguments or trust a caller-controlled header.
 */
export const DEMO_TENANT_ID = 'demo-tenant';
