import { OrdersService } from './orders.service';
import { PrismaService } from '../prisma/prisma.service';
import { DEMO_TENANT_ID } from '../common/tenant-scope';

describe('OrdersService', () => {
  const prisma = { order: { findMany: jest.fn(), findFirst: jest.fn() } };
  const service = new OrdersService(prisma as unknown as PrismaService);

  beforeEach(() => jest.clearAllMocks());

  it('lists only orders belonging to the server-selected tenant', async () => {
    prisma.order.findMany.mockResolvedValue([]);
    await service.findAll();
    expect(prisma.order.findMany).toHaveBeenCalledWith({
      where: { tenantId: DEMO_TENANT_ID },
      orderBy: { createdAt: 'desc' },
    });
  });

  it('serializes order totals as integer strings', async () => {
    prisma.order.findFirst.mockResolvedValue({
      id: 'o1', tenantId: DEMO_TENANT_ID, userId: 'u1', status: 'PAID',
      totalMinor: 12500n, currency: 'INR', createdAt: new Date(),
    });
    await expect(service.findById('o1')).resolves.toMatchObject({ totalMinor: '12500' });
  });
});
