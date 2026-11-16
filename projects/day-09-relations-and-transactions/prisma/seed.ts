import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.customer.upsert({
    where: { email: "asha@example.test" },
    update: { name: "Asha" },
    create: { email: "asha@example.test", name: "Asha" }
  });
  await prisma.product.upsert({
    where: { sku: "KB-ORDER-01" },
    update: { inventory: 20, priceMinor: 7999 },
    create: { sku: "KB-ORDER-01", name: "Mechanical Keyboard", priceMinor: 7999, inventory: 20 }
  });
  console.log("Seeded customer and product");
}
main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(async () => prisma.$disconnect());
