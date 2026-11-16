import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { PrismaClient, ProductStatus } from "@prisma/client";
import { ProductsRepository } from "../src/products.repository.js";

const prisma = new PrismaClient();
const repository = new ProductsRepository(prisma);
const sku = `TEST-${Date.now()}`;

before(async () => { await prisma.$connect(); });
after(async () => {
  await prisma.product.deleteMany({ where: { sku } });
  await prisma.$disconnect();
});

test("creates and reads a product from PostgreSQL", async () => {
  const created = await repository.create({ sku, name: "Integration Test Product", priceMinor: 1234, status: ProductStatus.ACTIVE });
  assert.equal(created.sku, sku);
  const found = await repository.findById(created.id);
  assert.equal(found?.name, "Integration Test Product");
});

test("filters products by status", async () => {
  const rows = await repository.list(ProductStatus.ACTIVE);
  assert.ok(rows.every((row) => row.status === ProductStatus.ACTIVE));
});

test("rejects negative and out-of-range prices before database access", () => {
  assert.throws(() => repository.create({ sku: "BAD-PRICE", name: "Invalid", priceMinor: -1 }), /PostgreSQL Int/);
  assert.throws(() => repository.create({ sku: "TOO-LARGE", name: "Invalid", priceMinor: 2_147_483_648 }), /PostgreSQL Int/);
});
