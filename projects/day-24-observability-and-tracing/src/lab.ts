import { buildSchema, graphql } from "graphql";
import { ResolverTelemetry } from "./telemetry.js";

export const telemetry = new ResolverTelemetry();
const schema = buildSchema(`
  type Product { id: ID!, name: String! }
  type Query { product(id: ID!): Product, health: String! }
`);
const products = [{ id: "p-1", name: "Keyboard" }];
const rootValue = {
  product: async ({ id }: { id: string }) => telemetry.measure("Query.product", () => {
    const product = products.find((item) => item.id === id);
    if (!product) throw new Error("Product not found");
    return product;
  }),
  health: () => telemetry.measure("Query.health", () => "ok")
};
export function execute(source: string) { return graphql({ schema, source, rootValue }); }
