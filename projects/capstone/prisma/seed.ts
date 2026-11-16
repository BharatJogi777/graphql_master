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

  await prisma.product.upsert({
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
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
