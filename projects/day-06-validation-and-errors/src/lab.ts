import { buildSchema, execute, parse, validate, GraphQLError } from "graphql";

const typeDefs = `
  type Product { id: ID!, name: String!, priceMinor: Int! }
  type Query { product(id: ID!): Product, products: [Product!]! }
`;
const products = [{ id: "p-1", name: "Keyboard", priceMinor: 7999 }];
export const schema = buildSchema(typeDefs);
const rootValue = {
  product: ({ id }: { id: string }) => products.find((product) => product.id === id) ?? null,
  products: () => products
};

export function parseDocument(source: string) {
  try { return { document: parse(source), errors: [] as GraphQLError[] }; }
  catch (error) { return { document: null, errors: [error as GraphQLError] }; }
}
export function validateDocument(source: string) {
  const parsed = parseDocument(source);
  if (!parsed.document) return parsed.errors;
  return validate(schema, parsed.document);
}
export async function runDocument(source: string, variableValues?: Record<string, unknown>) {
  const parsed = parseDocument(source);
  if (!parsed.document) return { errors: parsed.errors };
  const validationErrors = validate(schema, parsed.document);
  if (validationErrors.length) return { errors: validationErrors };
  return execute({ schema, document: parsed.document, rootValue, variableValues });
}
export function domainError(message: string) {
  return new GraphQLError(message, { extensions: { code: "PRODUCT_NOT_FOUND" } });
}
if (process.argv[1]?.endsWith("/lab.ts")) {
  for (const query of ["{ products { id name } }", "{ product(id: 42) { id } }", "{ product(id: \"p-1\") { missing } }"]) {
    console.log(query, JSON.stringify(await runDocument(query)));
  }
}
