import { buildSchema, graphql, parse, validate, type ASTVisitor } from "graphql";
import { visit } from "graphql";

const schema = buildSchema(`
  type Product { id: ID!, name: String!, reviews(first: Int = 5): [Review!]! }
  type Review { id: ID!, body: String!, author: String! }
  type Query { products(first: Int = 10): [Product!]!, health: String! }
`);
const reviews = Array.from({ length: 10 }, (_, i) => ({ id: `r-${i+1}`, body: "Review", author: "Customer" }));
const products = Array.from({ length: 5 }, (_, i) => ({ id: `p-${i+1}`, name: `Product ${i+1}`, reviews }));
const rootValue = { products: ({ first = 10 }: { first?: number }) => products.slice(0, first), health: () => "ok" };

export function analyzeQuery(source: string, maxDepth = 4, maxCost = 100) {
  const document = parse(source);
  const errors = validate(schema, document);
  if (errors.length) return { allowed: false, depth: 0, cost: 0, errors: errors.map((e) => e.message) };
  let depth = 0;
  let cost = 0;
  const fieldCosts: string[] = [];
  const visitor: ASTVisitor = {
    Field(node, _key, _parent, _path, ancestors) {
      const currentDepth = ancestors.filter((ancestor) => typeof ancestor === "object" && ancestor !== null && "kind" in ancestor && (ancestor as {kind:string}).kind === "Field").length + 1;
      depth = Math.max(depth, currentDepth);
      cost += currentDepth === 1 ? 1 : 2 ** (currentDepth - 1);
      fieldCosts.push(`${node.name.value}@${currentDepth}`);
    }
  };
  visit(document, visitor);
  const violations: string[] = [];
  if (depth > maxDepth) violations.push(`Query depth ${depth} exceeds limit ${maxDepth}`);
  if (cost > maxCost) violations.push(`Query cost ${cost} exceeds limit ${maxCost}`);
  return { allowed: violations.length === 0, depth, cost, fieldCosts, errors: violations };
}
export async function execute(source: string) {
  const analysis = analyzeQuery(source);
  if (!analysis.allowed) return { errors: analysis.errors, analysis };
  const result = await graphql({ schema, source, rootValue });
  return { ...result, analysis };
}
if (process.argv[1]?.endsWith("/lab.ts")) {
  console.log(JSON.stringify(await execute("{ products { id name reviews { id body } } }"), null, 2));
}
