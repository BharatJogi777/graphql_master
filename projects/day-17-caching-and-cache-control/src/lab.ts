import { buildSchema, graphql } from "graphql";

type Product = { id: string; name: string; priceMinor: number; updatedAt: number };
const products: Product[] = [
  { id: "p-1", name: "Keyboard", priceMinor: 7999, updatedAt: 1 },
  { id: "p-2", name: "USB-C Hub", priceMinor: 3499, updatedAt: 1 }
];
type CacheEntry = { value: Product | null; expiresAt: number };
export class ProductCache {
  private readonly entries = new Map<string, CacheEntry>();
  constructor(private readonly ttlMs = 30_000, private readonly now = () => Date.now()) {}
  get(id: string) {
    const entry = this.entries.get(id);
    if (!entry) return undefined;
    if (entry.expiresAt <= this.now()) { this.entries.delete(id); return undefined; }
    return entry.value;
  }
  set(id: string, value: Product | null) {
    this.entries.set(id, { value, expiresAt: this.now() + this.ttlMs });
  }
  invalidate(id: string) { this.entries.delete(id); }
  clear() { this.entries.clear(); }
  get size() { return this.entries.size; }
}
export const cache = new ProductCache();
export const metrics = { databaseReads: 0 };
const schema = buildSchema(`
  type Product { id: ID!, name: String!, priceMinor: Int! }
  type Query { product(id: ID!): Product, products: [Product!]! }
  type Mutation { renameProduct(id: ID!, name: String!): Product }
`);
const rootValue = {
  product: ({ id }: { id: string }) => {
    const cached = cache.get(id);
    if (cached !== undefined) return cached;
    metrics.databaseReads++;
    const product = products.find((item) => item.id === id) ?? null;
    cache.set(id, product);
    return product;
  },
  products: () => products,
  renameProduct: ({ id, name }: { id: string; name: string }) => {
    const product = products.find((item) => item.id === id);
    if (!product) return null;
    product.name = name;
    product.updatedAt++;
    cache.invalidate(id);
    return product;
  }
};
export function execute(source: string) { return graphql({ schema, source, rootValue }); }
export function reset() { cache.clear(); metrics.databaseReads = 0; }
if (process.argv[1]?.endsWith("/lab.ts")) {
  console.log(JSON.stringify(await execute('{ product(id:"p-1") { id name } }'), null, 2));
}
