import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { PrismaClient } from "@prisma/client";
import { OrdersService } from "../src/orders.service.js";

const prisma = new PrismaClient();
const service = new OrdersService(prisma);
let customerId = "";
let productId = "";
const sku = `TXN-${Date.now()}`;

before(async () => {
  await prisma.$connect();
  const customer = await prisma.customer.create({ data: { email: `txn-${Date.now()}@example.test`, name: "Transaction Tester" } });
  const product = await prisma.product.create({ data: { sku, name: "Test Item", priceMinor: 2500, inventory: 5 } });
  customerId = customer.id;
  productId = product.id;
});
after(async () => {
  await prisma.order.deleteMany({ where: { customerId } });
  await prisma.product.deleteMany({ where: { id: productId } });
  await prisma.customer.deleteMany({ where: { id: customerId } });
  await prisma.$disconnect();
});

test("creates order, snapshots unit price and decrements stock atomically", async () => {
  const order = await service.createOrder({ customerId, idempotencyKey: `order-${Date.now()}`, items: [{ productId, quantity: 2 }] });
  assert.equal(order.totalMinor, 5000);
  assert.equal(order.items[0]?.unitPriceMinor, 2500);
  const product = await prisma.product.findUniqueOrThrow({ where: { id: productId } });
  assert.equal(product.inventory, 3);
});

test("same idempotency key does not create a duplicate order", async () => {
  const key = `retry-${Date.now()}`;
  const input = { customerId, idempotencyKey: key, items: [{ productId, quantity: 1 }] };
  const first = await service.createOrder(input);
  const second = await service.createOrder(input);
  assert.equal(first.id, second.id);
  assert.equal(await prisma.order.count({ where: { idempotencyKey: key } }), 1);
});

test("rejects idempotency key reuse with different order input", async () => {
  const key = `mismatch-${Date.now()}`;
  await service.createOrder({ customerId, idempotencyKey: key, items: [{ productId, quantity: 1 }] });
  await assert.rejects(
    () => service.createOrder({ customerId, idempotencyKey: key, items: [{ productId, quantity: 2 }] }),
    /different order input/,
  );
});

test("rejects invalid quantities before opening a transaction", async () => {
  await assert.rejects(() => service.createOrder({ customerId, idempotencyKey: "invalid", items: [{ productId, quantity: 0 }] }), /positive integer/);
});
