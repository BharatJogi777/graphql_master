import { createServer } from "node:http";
import { buildSchema, graphql, GraphQLError } from "graphql";

type Product = { id: string; sku: string; name: string; priceMinor: number; tenantId: string };
const products: Product[] = [];
const idempotency = new Map<string, Product>();
let nextId = 1;

const schema = buildSchema(`
  input CreateProductInput { sku: String!, name: String!, priceMinor: Int! }
  type Product { id: ID!, sku: String!, name: String!, priceMinor: Int! }
  type Query { health: String!, products(first: Int = 10, after: ID): [Product!]! }
  type Mutation { createProduct(input: CreateProductInput!, idempotencyKey: String!): Product! }
`);

const rootValue = {
  health: () => "ok",
  products: ({ first = 10, after }: { first?: number; after?: string }, context: { tenantId: string }) => {
    if (!Number.isInteger(first) || first < 1 || first > 50) throw new GraphQLError("first must be between 1 and 50", { extensions: { code: "BAD_USER_INPUT" } });
    const tenantProducts = products.filter((product) => product.tenantId === context.tenantId);
    const start = after ? tenantProducts.findIndex((product) => product.id === after) + 1 : 0;
    return tenantProducts.slice(start, start + first);
  },
  createProduct: ({ input, idempotencyKey }: { input: { sku: string; name: string; priceMinor: number }; idempotencyKey: string }, context: { tenantId: string }) => {
    const key = `${context.tenantId}:${idempotencyKey}`;
    const existing = idempotency.get(key);
    if (existing) return existing;
    const sku = input.sku.trim().toUpperCase();
    const name = input.name.trim();
    if (!sku || !name || !Number.isSafeInteger(input.priceMinor) || input.priceMinor < 0) {
      throw new GraphQLError("Invalid product input", { extensions: { code: "BAD_USER_INPUT" } });
    }
    if (products.some((product) => product.tenantId === context.tenantId && product.sku === sku)) {
      throw new GraphQLError("SKU already exists", { extensions: { code: "CONFLICT" } });
    }
    const product = { id: String(nextId++), sku, name, priceMinor: input.priceMinor, tenantId: context.tenantId };
    products.push(product);
    idempotency.set(key, product);
    return product;
  }
};

export async function execute(source: string, variableValues?: Record<string, unknown>, tenantId = "tenant-demo") {
  return graphql({ schema, source, rootValue, variableValues, contextValue: { tenantId } });
}

export function reset() { products.splice(0); idempotency.clear(); nextId = 1; }

async function main() {
  const server = createServer(async (request, response) => {
    if (request.url === "/health/live" || request.url === "/health/ready") {
      response.writeHead(200, { "content-type": "application/json" });
      response.end(JSON.stringify({ status: "ok" }));
      return;
    }
    if (request.method !== "POST" || request.url !== "/graphql") {
      response.writeHead(404); response.end(); return;
    }
    let body = "";
    for await (const chunk of request) body += chunk;
    if (body.length > 1_000_000) { response.writeHead(413); response.end(); return; }
    try {
      const payload = JSON.parse(body) as { query?: string; variables?: Record<string, unknown> };
      const result = await execute(payload.query ?? "", payload.variables, request.headers["x-tenant-id"]?.toString() ?? "tenant-demo");
      response.writeHead(result.errors?.length ? 400 : 200, { "content-type": "application/json" });
      response.end(JSON.stringify(result));
    } catch {
      response.writeHead(400, { "content-type": "application/json" });
      response.end(JSON.stringify({ errors: [{ message: "Invalid request", extensions: { code: "BAD_REQUEST" } }] }));
    }
  });
  const port = Number(process.env.PORT ?? 4000);
  server.listen(port, () => console.log(`Final GraphQL capstone listening on :${port}`));
  const shutdown = () => server.close();
  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

if (process.argv[1]?.endsWith("/server.ts")) void main();
