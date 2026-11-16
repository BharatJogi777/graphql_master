import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const tenant = await prisma.tenant.upsert({
    where: { id: 'demo-tenant' },
    update: {},
    create: { id: 'demo-tenant', name: 'Demo Store' },
  });

  await prisma.user.upsert({
    where: { tenantId_email: { tenantId: tenant.id, email: 'admin@example.com' } },
    update: { name: 'Demo Admin', role: 'ADMIN' },
    create: {
      tenantId: tenant.id,
      email: 'admin@example.com',
      name: 'Demo Admin',
      role: 'ADMIN',
    },
  });

  const customer = await prisma.user.upsert({
    where: { tenantId_email: { tenantId: tenant.id, email: 'customer@example.com' } },
    update: { name: 'Demo Customer' },
    create: {
      tenantId: tenant.id,
      email: 'customer@example.com',
      name: 'Demo Customer',
      role: 'CUSTOMER',
    },
  });

  const product = await prisma.product.upsert({
    where: { tenantId_sku: { tenantId: tenant.id, sku: 'DEMO-001' } },
    update: {},
    create: {
      tenantId: tenant.id,
      sku: 'DEMO-001',
      name: 'Demo Product',
      description: 'Seed data for local learning only',
      priceMinor: 129900n,
      currency: 'INR',
      status: 'ACTIVE',
    },
  });

  const existingOrder = await prisma.order.findFirst({
    where: { tenantId: tenant.id, userId: customer.id },
  });
  if (!existingOrder) {
    await prisma.order.create({
      data: {
        tenantId: tenant.id,
        userId: customer.id,
        totalMinor: product.priceMinor,
        currency: product.currency,
        status: 'PAID',
        items: {
          create: [{
            tenantId: tenant.id,
            productId: product.id,
            quantity: 1,
            unitPriceMinor: product.priceMinor,
          }],
        },
      },
    });
  }
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
