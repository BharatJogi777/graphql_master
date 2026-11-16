import { buildSchema, graphql } from "graphql";

export const typeDefs = `
  enum ProductStatus { DRAFT ACTIVE ARCHIVED }
  input CreateProductInput {
    name: String!
    priceMinor: Int!
    description: String
    status: ProductStatus = DRAFT
  }
  type Product {
    id: ID!
    name: String!
    priceMinor: Int!
    description: String
    status: ProductStatus!
  }
  type Query { products: [Product!]! }
  type Mutation {
    createProduct(input: CreateProductInput!): Product!
    archiveProduct(id: ID!): Product
  }
`;

export type ProductStatus = "DRAFT" | "ACTIVE" | "ARCHIVED";
export interface Product {
  id: string; name: string; priceMinor: number; description: string | null; status: ProductStatus;
}

const initial: Product[] = [
  { id: "p-1", name: "Keyboard", priceMinor: 7999, description: null, status: "ACTIVE" }
];
let products: Product[] = [...initial];
let sequence = 2;

export function resetStore() { products = [...initial]; sequence = 2; }
export const schema = buildSchema(typeDefs);
export const rootValue = {
  products: () => products,
  createProduct: ({ input }: { input: Omit<Product, "id" | "status"> & { status?: ProductStatus } }) => {
    const product: Product = { id: `p-${sequence++}`, ...input, status: input.status ?? "DRAFT" };
    products.push(product);
    return product;
  },
  archiveProduct: ({ id }: { id: string }) => {
    const product = products.find((item) => item.id === id);
    if (!product) return null;
    product.status = "ARCHIVED";
    return product;
  }
};
export function execute(source: string, variableValues?: Record<string, unknown>) {
  return graphql({ schema, source, rootValue, variableValues });
}
if (process.argv[1]?.endsWith("/lab.ts")) {
  console.log(JSON.stringify(await execute(`mutation { createProduct(input: { name: "Desk", priceMinor: 12999 }) { id name status } }`), null, 2));
}
