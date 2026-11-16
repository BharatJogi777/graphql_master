import { PrismaClient, ProductStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const products = [
    { sku: "KB-001", name: "Mechanical Keyboard", description: "Hot-swappable keyboard", priceMinor: 7999, status: ProductStatus.ACTIVE },
    { sku: "HUB-001", name: "USB-C Hub", description: null, priceMinor: 3499, status: ProductStatus.DRAFT }
  ];
  for (const product of products) {
    await prisma.product.upsert({
      where: { sku: product.sku },
      update: product,
      create: product
    });
  }
  console.log(`Seeded ${products.length} products`);
}

main()
  .catch((error) => { console.error(error); process.exitCode = 1; })
  .finally(async () => { await prisma.$disconnect(); });
