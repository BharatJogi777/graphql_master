import { ProductsService } from './products.service';
import { PrismaService } from '../prisma/prisma.service';
import { DEMO_TENANT_ID } from '../common/tenant-scope';

describe('ProductsService', () => {
  const prisma = {
    product: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      updateMany: jest.fn(),
      deleteMany: jest.fn(),
    },
  };
  const service = new ProductsService(prisma as unknown as PrismaService);

  beforeEach(() => jest.clearAllMocks());

  it('always scopes product listing to the demo tenant', async () => {
    prisma.product.findMany.mockResolvedValue([]);
    await service.findAll();
    expect(prisma.product.findMany).toHaveBeenCalledWith({
      where: { tenantId: DEMO_TENANT_ID },
      orderBy: { createdAt: 'desc' },
    });
  });

  it('serializes bigint money as a string', async () => {
    prisma.product.findFirst.mockResolvedValue({
      id: 'p1', tenantId: DEMO_TENANT_ID, sku: 'SKU-1', name: 'Item',
      description: null, priceMinor: 1999n, currency: 'INR', status: 'ACTIVE',
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
    });
    await expect(service.findById('p1')).resolves.toMatchObject({ priceMinor: '1999' });
    expect(prisma.product.findFirst).toHaveBeenCalledWith({
      where: { id: 'p1', tenantId: DEMO_TENANT_ID },
    });
  });

  it('creates a product using BigInt minor units and server-owned tenant scope', async () => {
    prisma.product.create.mockResolvedValue({
      id: 'p2', tenantId: DEMO_TENANT_ID, sku: 'SKU-2', name: 'Item',
      description: undefined, priceMinor: 2500n, currency: 'INR', status: 'DRAFT',
      createdAt: new Date(),
    });
    await service.create({ sku: 'SKU-2', name: 'Item', priceMinor: '2500', currency: 'INR', status: 'DRAFT' });
    expect(prisma.product.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ tenantId: DEMO_TENANT_ID, priceMinor: 2500n }),
    }));
  });

  it('does not expose a product from another tenant', async () => {
    prisma.product.findFirst.mockResolvedValue(null);
    await expect(service.findById('other-tenant-product')).rejects.toThrow('Product not found');
    expect(prisma.product.findFirst).toHaveBeenCalledWith({
      where: { id: 'other-tenant-product', tenantId: DEMO_TENANT_ID },
    });
  });
});
