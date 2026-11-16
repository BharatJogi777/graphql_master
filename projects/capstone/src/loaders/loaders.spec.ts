import { createRequestLoaders } from './loaders';
import { PrismaService } from '../prisma/prisma.service';

describe('request-scoped DataLoaders', () => {
  const prisma = {
    user: { findMany: jest.fn() },
    product: { findMany: jest.fn() },
    order: { findMany: jest.fn() },
    orderItem: { findMany: jest.fn() },
  };

  beforeEach(() => jest.clearAllMocks());

  it('batches customer lookups into one tenant-scoped query and restores key order', async () => {
    prisma.user.findMany.mockResolvedValue([
      { id: 'u2', tenantId: 'tenant-a', name: 'Second' },
      { id: 'u1', tenantId: 'tenant-a', name: 'First' },
    ]);
    const loaders = createRequestLoaders(prisma as unknown as PrismaService, 'tenant-a');

    const [first, second] = await Promise.all([
      loaders.customerById.load('u1'),
      loaders.customerById.load('u2'),
    ]);

    expect(first?.id).toBe('u1');
    expect(second?.id).toBe('u2');
    expect(prisma.user.findMany).toHaveBeenCalledTimes(1);
    expect(prisma.user.findMany).toHaveBeenCalledWith({
      where: { tenantId: 'tenant-a', id: { in: ['u1', 'u2'] } },
    });
  });

  it('returns empty arrays for customers without orders and batches order lookups', async () => {
    prisma.order.findMany.mockResolvedValue([
      { id: 'o1', userId: 'u1', tenantId: 'tenant-a' },
      { id: 'o2', userId: 'u1', tenantId: 'tenant-a' },
    ]);
    const loaders = createRequestLoaders(prisma as unknown as PrismaService, 'tenant-a');
    const [u1, u2] = await Promise.all([
      loaders.ordersByCustomerId.load('u1'),
      loaders.ordersByCustomerId.load('u2'),
    ]);
    expect(u1).toHaveLength(2);
    expect(u2).toEqual([]);
    expect(prisma.order.findMany).toHaveBeenCalledTimes(1);
  });

  it('does not share cache between separate GraphQL requests', async () => {
    prisma.user.findMany.mockResolvedValue([{ id: 'u1', tenantId: 'tenant-a' }]);
    const requestA = createRequestLoaders(prisma as unknown as PrismaService, 'tenant-a');
    const requestB = createRequestLoaders(prisma as unknown as PrismaService, 'tenant-a');
    await Promise.all([
      requestA.customerById.load('u1'),
      requestB.customerById.load('u1'),
    ]);
    expect(prisma.user.findMany).toHaveBeenCalledTimes(2);
  });
});
