import { composeServices } from "@apollo/composition";
import { parse } from "graphql";

export const catalogSdl = `
  extend schema @link(url: "https://specs.apollo.dev/federation/v2.7", import: ["@key"])
  type Product @key(fields: "id") {
    id: ID!
    sku: String!
    name: String!
  }
  type Query { product(id: ID!): Product }
`;

export const inventorySdl = `
  extend schema @link(url: "https://specs.apollo.dev/federation/v2.7", import: ["@key"])
  extend type Product @key(fields: "id") {
    id: ID! @external
    stockAvailable: Int!
  }
  type Query { inventoryHealth: String! }
`;

export function compose() {
  // Apollo composition accepts parsed GraphQL documents, not raw SDL strings.
  return composeServices([
    { name: "catalog", typeDefs: parse(catalogSdl) },
    { name: "inventory", typeDefs: parse(inventorySdl) }
  ]);
}
