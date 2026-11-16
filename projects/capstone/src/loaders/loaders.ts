import DataLoader from 'dataloader';
import { Product as PrismaProduct, User as PrismaUser } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { DEMO_TENANT_ID } from '../common/tenant-scope';

export interface RequestLoaders {
  customerById: DataLoader<string, PrismaUser | null>;
  productById: DataLoader<string, PrismaProduct | null>;
  ordersByCustomerId: DataLoader<string, Array<{
    id: string; tenantId: string; userId: string; status: string;
    totalMinor: bigint; currency: string; createdAt: Date;
  }>>;
  orderItemsByOrderId: DataLoader<string, Array<{
    id: string; tenantId: string; orderId: string; productId: string;
    quantity: number; unitPriceMinor: bigint;
  }>>;
}

/** A fresh loader collection is created per GraphQL request, never shared globally. */
export function createRequestLoaders(
  prisma: PrismaService,
  tenantId = DEMO_TENANT_ID,
): RequestLoaders {
  return {
    customerById: new DataLoader(async (ids) => {
      const rows = await prisma.user.findMany({
        where: { tenantId, id: { in: [...ids] } },
      });
      const byId = new Map(rows.map((row) => [row.id, row]));
      return ids.map((id) => byId.get(id) ?? null);
    }),
    productById: new DataLoader(async (ids) => {
      const rows = await prisma.product.findMany({
        where: { tenantId, id: { in: [...ids] } },
      });
      const byId = new Map(rows.map((row) => [row.id, row]));
      return ids.map((id) => byId.get(id) ?? null);
    }),
    ordersByCustomerId: new DataLoader(async (customerIds) => {
      const rows = await prisma.order.findMany({
        where: { tenantId, userId: { in: [...customerIds] } },
        orderBy: { createdAt: 'desc' },
      });
      const grouped = new Map<string, typeof rows>();
      for (const row of rows) {
        const group = grouped.get(row.userId) ?? [];
        group.push(row);
        grouped.set(row.userId, group);
      }
      return customerIds.map((id) => grouped.get(id) ?? []);
    }),
    orderItemsByOrderId: new DataLoader(async (orderIds) => {
      const rows = await prisma.orderItem.findMany({
        where: { tenantId, orderId: { in: [...orderIds] } },
        orderBy: { id: 'asc' },
      });
      const grouped = new Map<string, typeof rows>();
      for (const row of rows) {
        const group = grouped.get(row.orderId) ?? [];
        group.push(row);
        grouped.set(row.orderId, group);
      }
      return orderIds.map((id) => grouped.get(id) ?? []);
    }),
  };
}
