import { buildSchema, graphql, GraphQLError } from "graphql";

export type Principal = { id: string; role: "USER" | "ADMIN"; tenantId: string };
export type Context = { principal: Principal | null };
type Project = { id: string; tenantId: string; ownerId: string; name: string; secret: string };
const projects: Project[] = [
  { id: "pr-1", tenantId: "tenant-a", ownerId: "u-1", name: "A Project", secret: "alpha-secret" },
  { id: "pr-2", tenantId: "tenant-b", ownerId: "u-2", name: "B Project", secret: "beta-secret" }
];
const schema = buildSchema(`
  type Project { id: ID!, name: String!, secret: String }
  type Query { project(id: ID!): Project, projects: [Project!]! }
`);
function requirePrincipal(context: Context): Principal {
  if (!context.principal) throw new GraphQLError("Authentication required", { extensions: { code: "UNAUTHENTICATED" } });
  return context.principal;
}
function canReadProject(project: Project, principal: Principal) {
  return principal.role === "ADMIN" || (project.tenantId === principal.tenantId && project.ownerId === principal.id);
}
const rootValue = {
  project: ({ id }: { id: string }, context: Context) => {
    const principal = requirePrincipal(context);
    const project = projects.find((item) => item.id === id);
    if (!project || !canReadProject(project, principal)) return null;
    return project;
  },
  projects: (_args: unknown, context: Context) => {
    const principal = requirePrincipal(context);
    return projects.filter((project) => project.tenantId === principal.tenantId);
  }
};
export function execute(source: string, principal: Principal | null) {
  return graphql({ schema, source, rootValue, contextValue: { principal } });
}
