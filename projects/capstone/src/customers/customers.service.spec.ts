import { CustomersService } from './customers.service';
import { PrismaService } from '../prisma/prisma.service';
import { DEMO_TENANT_ID } from '../common/tenant-scope';

describe('CustomersService', () => {
  const prisma = {
    user: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      updateMany: jest.fn(),
      deleteMany: jest.fn(),
    },
  };
  const service = new CustomersService(prisma as unknown as PrismaService);

  beforeEach(() => jest.clearAllMocks());

  it('always scopes customer listing to the demo tenant', async () => {
    prisma.user.findMany.mockResolvedValue([]);
    await service.findAll();
    expect(prisma.user.findMany).toHaveBeenCalledWith({
      where: { tenantId: DEMO_TENANT_ID },
      orderBy: { createdAt: 'desc' },
    });
  });

  it('normalizes email and creates a customer with the least-privileged role', async () => {
    prisma.user.create.mockResolvedValue({ id: 'u1', email: 'user@example.com', role: 'CUSTOMER' });
    await service.create({ email: 'USER@EXAMPLE.COM', name: 'User' });
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: { tenantId: DEMO_TENANT_ID, email: 'user@example.com', name: 'User', role: 'CUSTOMER' },
    });
  });

  it('does not expose a customer from another tenant', async () => {
    prisma.user.findFirst.mockResolvedValue(null);
    await expect(service.findById('foreign-user')).rejects.toThrow('Customer not found');
    expect(prisma.user.findFirst).toHaveBeenCalledWith({
      where: { id: 'foreign-user', tenantId: DEMO_TENANT_ID },
    });
  });
});
