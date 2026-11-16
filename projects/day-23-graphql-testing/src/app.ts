import { buildSchema, graphql } from "graphql";

const schema = buildSchema(`
  type Product { id: ID!, sku: String!, name: String!, priceMinor: Int! }
  type Query { product(id: ID!): Product, products: [Product!]! }
  type Mutation { renameProduct(id: ID!, name: String!): Product }
`);
const products = [
  { id: "p-1", sku: "KB-1", name: "Keyboard", priceMinor: 7999 },
  { id: "p-2", sku: "HUB-1", name: "USB Hub", priceMinor: 3499 }
];
const rootValue = {
  product: ({ id }: { id: string }) => products.find((product) => product.id === id) ?? null,
  products: () => products,
  renameProduct: ({ id, name }: { id: string; name: string }) => {
    const product = products.find((item) => item.id === id);
    if (!product) return null;
    product.name = name;
    return product;
  }
};
export function execute(source: string, variableValues?: Record<string, unknown>) {
  return graphql({ schema, source, rootValue, variableValues });
}
export function reset() {
  products[0]!.name = "Keyboard";
  products[1]!.name = "USB Hub";
}
