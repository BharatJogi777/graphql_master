import { createServer } from "node:http";
import { buildSchema, graphql, GraphQLError } from "graphql";

type Product = { id: string; sku: string; name: string; priceMinor: number; tenantId: string };
type IdempotencyRecord = { fingerprint: string; product: Product };
const products: Product[] = [];
const idempotency = new Map<string, IdempotencyRecord>();
let nextId = 1;

const schema = buildSchema(`
  input CreateProductInput { sku: String!, name: String!, priceMinor: Int! }
  type Product { id: ID!, sku: String!, name: String!, priceMinor: Int! }
  type Query { health: String!, products(first: Int = 10, after: ID): [Product!]! }
  type Mutation { createProduct(input: CreateProductInput!, idempotencyKey: String!): Product! }
`);

const badInput = (message: string) =>
  new GraphQLError(message, { extensions: { code: "BAD_USER_INPUT" } });

const rootValue = {
  health: () => "ok",
  products: ({ first = 10, after }: { first?: number; after?: string }, context: { tenantId: string }) => {
    if (!Number.isInteger(first) || first < 1 || first > 50) {
      throw badInput("first must be between 1 and 50");
    }
    const tenantProducts = products.filter((product) => product.tenantId === context.tenantId);
    const cursorIndex = after
      ? tenantProducts.findIndex((product) => product.id === after)
      : -1;
    if (after && cursorIndex < 0) throw badInput("Invalid pagination cursor");
    const start = after ? cursorIndex + 1 : 0;
    return tenantProducts.slice(start, start + first);
  },
  createProduct: (
    { input, idempotencyKey }: {
      input: { sku: string; name: string; priceMinor: number };
      idempotencyKey: string;
    },
    context: { tenantId: string },
  ) => {
    const normalizedKey = idempotencyKey.trim();
    const sku = input.sku.trim().toUpperCase();
    const name = input.name.trim();
    if (!normalizedKey || normalizedKey.length > 128) {
      throw badInput("idempotencyKey must contain between 1 and 128 characters");
    }
    if (!sku || !name || !Number.isSafeInteger(input.priceMinor) || input.priceMinor < 0) {
      throw badInput("Invalid product input");
    }

    const key = `${context.tenantId}:${normalizedKey}`;
    const fingerprint = JSON.stringify({ sku, name, priceMinor: input.priceMinor });
    const existing = idempotency.get(key);
    if (existing) {
      if (existing.fingerprint !== fingerprint) {
        throw new GraphQLError("Idempotency key was already used with a different request", {
          extensions: { code: "CONFLICT" },
        });
      }
      return existing.product;
    }

    if (products.some((product) => product.tenantId === context.tenantId && product.sku === sku)) {
      throw new GraphQLError("SKU already exists", { extensions: { code: "CONFLICT" } });
    }
    const product = { id: String(nextId++), sku, name, priceMinor: input.priceMinor, tenantId: context.tenantId };
    products.push(product);
    idempotency.set(key, { fingerprint, product });
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
    let bodyTooLarge = false;
    for await (const chunk of request) {
      if (bodyTooLarge) continue;
      body += chunk.toString();
      if (Buffer.byteLength(body, "utf8") > 1_000_000) {
        bodyTooLarge = true;
        body = "";
      }
    }
    if (bodyTooLarge) { response.writeHead(413); response.end(); return; }
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
  let shuttingDown = false;
  const shutdown = async () => {
    if (shuttingDown) return;
    shuttingDown = true;
    await new Promise<void>((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve());
    });
  };
  process.on("SIGTERM", () => void shutdown());
  process.on("SIGINT", () => void shutdown());
}

if (process.argv[1]?.endsWith("/server.ts")) void main();
