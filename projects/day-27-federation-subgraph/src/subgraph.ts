import { buildSubgraphSchema } from "@apollo/subgraph";
import { parse } from "graphql";

const products = [
  { id: "p-1", sku: "KB-1", name: "Keyboard" },
  { id: "p-2", sku: "HUB-1", name: "USB Hub" }
];

export const typeDefs = parse(`
  type Product @key(fields: "id") {
    id: ID!
    sku: String!
    name: String!
  }
  type Query {
    product(id: ID!): Product
    products: [Product!]!
  }
`);

export const resolvers = {
  Query: {
    product: (_: unknown, { id }: { id: string }) => products.find((item) => item.id === id) ?? null,
    products: () => products
  },
  Product: {
    __resolveReference(reference: { id: string }) {
      return products.find((item) => item.id === reference.id) ?? null;
    }
  }
};

export const schema = buildSubgraphSchema([{ typeDefs, resolvers }]);
