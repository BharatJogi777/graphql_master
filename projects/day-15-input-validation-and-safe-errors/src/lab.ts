import { buildSchema, graphql, GraphQLError } from "graphql";

const schema = buildSchema(`
  input CreateProductInput { sku: String!, name: String!, priceMinor: Int! }
  type Product { id: ID!, sku: String!, name: String!, priceMinor: Int! }
  type Query { products: [Product!]! }
  type Mutation { createProduct(input: CreateProductInput!): Product! }
`);
const products: Array<{ id: string; sku: string; name: string; priceMinor: number }> = [];
let sequence = 0;
const rootValue = {
  products: () => products,
  createProduct: ({ input }: { input: { sku: string; name: string; priceMinor: number } }) => {
    const sku = input.sku.trim().toUpperCase();
    const name = input.name.trim();
    if (!sku || !name) throw new GraphQLError("SKU and name are required", { extensions: { code: "BAD_USER_INPUT" } });
    if (!Number.isSafeInteger(input.priceMinor) || input.priceMinor < 0) {
      throw new GraphQLError("priceMinor must be a non-negative integer", { extensions: { code: "BAD_USER_INPUT" } });
    }
    if (products.some((product) => product.sku === sku)) {
      throw new GraphQLError("A product with this SKU already exists", { extensions: { code: "CONFLICT" } });
    }
    const product = { id: String(++sequence), sku, name, priceMinor: input.priceMinor };
    products.push(product);
    return product;
  }
};
export function execute(source: string, variableValues?: Record<string, unknown>) {
  return graphql({ schema, source, rootValue, variableValues });
}
export function reset() { products.splice(0); sequence = 0; }
if (process.argv[1]?.endsWith("/lab.ts")) {
  const result = await execute(`mutation($input: CreateProductInput!) { createProduct(input: $input) { id sku name } }`, {
    input: { sku: " kb-1 ", name: " Keyboard ", priceMinor: 7999 }
  });
  console.log(JSON.stringify(result, null, 2));
}
