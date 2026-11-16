import { composeServices } from "@apollo/composition";

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
  return composeServices([
    { name: "catalog", typeDefs: catalogSdl },
    { name: "inventory", typeDefs: inventorySdl }
  ]);
}
