import { PrismaClient, ProductStatus } from "@prisma/client";

export class ProductsRepository {
  constructor(private readonly prisma: PrismaClient) {}

  list(status?: ProductStatus) {
    return this.prisma.product.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: "desc" }
    });
  }

  findById(id: string) {
    return this.prisma.product.findUnique({ where: { id } });
  }

  create(input: { sku: string; name: string; description?: string | null; priceMinor: number; status?: ProductStatus }) {
    if (!Number.isInteger(input.priceMinor) || input.priceMinor < 0 || input.priceMinor > 2_147_483_647) {
      throw new Error("priceMinor must be a non-negative PostgreSQL Int value");
    }
    return this.prisma.product.create({ data: input });
  }
}
