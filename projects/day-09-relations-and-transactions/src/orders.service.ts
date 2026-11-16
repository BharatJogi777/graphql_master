import { Prisma, PrismaClient } from "@prisma/client";

export interface CreateOrderInput {
  customerId: string;
  idempotencyKey: string;
  items: Array<{ productId: string; quantity: number }>;
}

export class OrdersService {
  constructor(private readonly prisma: PrismaClient) {}

  async createOrder(input: CreateOrderInput) {
    if (!input.items.length) throw new Error("An order must contain at least one item");
    if (new Set(input.items.map((item) => item.productId)).size !== input.items.length) {
      throw new Error("Duplicate product lines are not allowed");
    }
    for (const item of input.items) {
      if (!Number.isSafeInteger(item.quantity) || item.quantity <= 0) {
        throw new Error("Item quantity must be a positive integer");
      }
    }

    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.order.findUnique({
        where: { idempotencyKey: input.idempotencyKey },
        include: { items: true }
      });
      if (existing) return existing;

      const customer = await tx.customer.findUnique({ where: { id: input.customerId } });
      if (!customer) throw new Error("Customer not found");

      const productIds = input.items.map((item) => item.productId);
      const products = await tx.product.findMany({ where: { id: { in: productIds } } });
      if (products.length !== productIds.length) throw new Error("One or more products were not found");

      const productById = new Map(products.map((product) => [product.id, product]));
      let totalMinor = 0;
      const orderItems = input.items.map((item) => {
        const product = productById.get(item.productId)!;
        totalMinor += product.priceMinor * item.quantity;
        return { productId: product.id, quantity: item.quantity, unitPriceMinor: product.priceMinor };
      });
      if (!Number.isSafeInteger(totalMinor)) throw new Error("Order total exceeds safe integer range");

      for (const item of input.items) {
        const updated = await tx.product.updateMany({
          where: { id: item.productId, inventory: { gte: item.quantity } },
          data: { inventory: { decrement: item.quantity } }
        });
        if (updated.count !== 1) throw new Error("Insufficient inventory");
      }

      return tx.order.create({
        data: {
          customerId: input.customerId,
          idempotencyKey: input.idempotencyKey,
          totalMinor,
          items: { create: orderItems }
        },
        include: { items: true }
      });
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  }
}
