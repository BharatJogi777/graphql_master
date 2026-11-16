import { buildSchema, graphql, validate, parse } from "graphql";

export const oldSchema = buildSchema(`
  type User { id: ID!, name: String! }
  type Query { user(id: ID!): User }
`);

export const evolvedSchema = buildSchema(`
  type User {
    id: ID!
    name: String!
    displayName: String!
    legacyName: String @deprecated(reason: "Use displayName instead.")
  }
  type Query { user(id: ID!): User }
`);

const user = { id: "u-1", name: "Asha", displayName: "Asha J." };
const rootValue = { user: () => user };

export async function execute(source: string) {
  return graphql({ schema: evolvedSchema, source, rootValue });
}
export function validateAgainst(schema: typeof oldSchema, source: string) {
  return validate(schema, parse(source));
}
if (process.argv[1]?.endsWith("/lab.ts")) {
  console.log(JSON.stringify(await execute(`{ user(id: "u-1") { name displayName legacyName } }`), null, 2));
}
