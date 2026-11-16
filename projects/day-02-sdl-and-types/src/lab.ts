import { buildSchema, graphql, printSchema } from "graphql";

export const typeDefs = `
  enum ProductStatus { DRAFT ACTIVE ARCHIVED }

  type Product {
    id: ID!
    name: String!
    description: String
    priceMinor: Int!
    status: ProductStatus!
  }

  type Query {
    product(id: ID!): Product
    products(status: ProductStatus): [Product!]!
  }
`;

export interface Product {
  id: string;
  name: string;
  description: string | null;
  priceMinor: number;
  status: "DRAFT" | "ACTIVE" | "ARCHIVED";
}

export const products: Product[] = [
  { id: "p-1", name: "Mechanical Keyboard", description: "Hot-swappable keyboard", priceMinor: 7999, status: "ACTIVE" },
  { id: "p-2", name: "USB-C Hub", description: null, priceMinor: 3499, status: "DRAFT" },
  { id: "p-3", name: "Monitor Arm", description: "Aluminium arm", priceMinor: 5299, status: "ACTIVE" }
];

export const schema = buildSchema(typeDefs);

export const rootValue = {
  product: ({ id }: { id: string }) => products.find((product) => product.id === id) ?? null,
  products: ({ status }: { status?: Product["status"] }) =>
    status ? products.filter((product) => product.status === status) : products
};

export async function execute(source: string, variableValues?: Record<string, unknown>) {
  return graphql({ schema, source, rootValue, variableValues });
}

if (process.argv[1]?.endsWith("/lab.ts")) {
  const result = await execute(`query { products { id name priceMinor status } }`);
  console.log(JSON.stringify(result, null, 2));
}

export function schemaSDL(): string {
  return printSchema(schema);
}
