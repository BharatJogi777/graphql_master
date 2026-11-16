import { buildSchema, graphql, GraphQLError } from "graphql";

export interface Principal { id: string; email: string; role: "USER" | "ADMIN" }
export interface RequestContext { principal: Principal | null }
const users = [
  { id: "u-1", email: "asha@example.test", role: "USER" as const },
  { id: "u-2", email: "admin@example.test", role: "ADMIN" as const }
];
const schema = buildSchema(`
  type Viewer { id: ID!, email: String!, role: String! }
  type Query { publicMessage: String!, viewer: Viewer }
`);

export function authenticate(authorization?: string): Principal | null {
  if (!authorization?.startsWith("Bearer ")) return null;
  const token = authorization.slice("Bearer ".length);
  // Demo only: production must verify signature, issuer, audience and expiry.
  return users.find((user) => user.id === token) ?? null;
}
const rootValue = {
  publicMessage: () => "This field is public",
  viewer: (_args: unknown, context: RequestContext) => {
    if (!context.principal) {
      throw new GraphQLError("Authentication required", { extensions: { code: "UNAUTHENTICATED" } });
    }
    return context.principal;
  }
};
export function execute(source: string, authorization?: string) {
  const contextValue = { principal: authenticate(authorization) };
  return graphql({ schema, source, rootValue, contextValue });
}
if (process.argv[1]?.endsWith("/lab.ts")) {
  console.log(JSON.stringify(await execute("{ publicMessage viewer { id email role } }", "Bearer u-1"), null, 2));
}
