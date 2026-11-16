import { Injectable, NotFoundException } from '@nestjs/common';
import { DEMO_TENANT_ID } from '../common/tenant-scope';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const orders = await this.prisma.order.findMany({
      where: { tenantId: DEMO_TENANT_ID },
      orderBy: { createdAt: 'desc' },
    });
    return orders.map((order) => this.toGraphql(order));
  }

  async findById(id: string) {
    const order = await this.prisma.order.findFirst({
      where: { id, tenantId: DEMO_TENANT_ID },
    });
    if (!order) throw new NotFoundException('Order not found');
    return this.toGraphql(order);
  }

  private toGraphql<T extends { totalMinor: bigint }>(order: T) {
    return { ...order, totalMinor: order.totalMinor.toString() };
  }
}
