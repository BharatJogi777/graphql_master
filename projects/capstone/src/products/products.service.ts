import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, ProductStatus } from '@prisma/client';
import { DEMO_TENANT_ID } from '../common/tenant-scope';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductInput, UpdateProductInput } from './product.types';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const rows = await this.prisma.product.findMany({
      where: { tenantId: DEMO_TENANT_ID },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((row) => this.toGraphql(row));
  }

  async findById(id: string) {
    const row = await this.prisma.product.findFirst({
      where: { id, tenantId: DEMO_TENANT_ID },
    });
    if (!row) throw new NotFoundException('Product not found');
    return this.toGraphql(row);
  }

  async create(input: CreateProductInput) {
    try {
      const row = await this.prisma.product.create({
        data: {
          tenantId: DEMO_TENANT_ID,
          sku: input.sku,
          name: input.name,
          description: input.description,
          priceMinor: BigInt(input.priceMinor),
          currency: input.currency,
          status: input.status ?? ProductStatus.DRAFT,
        },
      });
      return this.toGraphql(row);
    } catch (error) {
      if (this.isUniqueConstraintError(error)) {
        throw new ConflictException('A product with this SKU already exists');
      }
      throw error;
    }
  }

  async update(id: string, input: UpdateProductInput) {
    const data: Prisma.ProductUpdateManyMutationInput = {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.priceMinor !== undefined ? { priceMinor: BigInt(input.priceMinor) } : {}),
      ...(input.currency !== undefined ? { currency: input.currency } : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
    };

    const result = await this.prisma.product.updateMany({
      where: { id, tenantId: DEMO_TENANT_ID },
      data,
    });
    if (result.count === 0) throw new NotFoundException('Product not found');
    return this.findById(id);
  }

  async remove(id: string): Promise<boolean> {
    try {
      const result = await this.prisma.product.deleteMany({
        where: { id, tenantId: DEMO_TENANT_ID },
      });
      if (result.count === 0) throw new NotFoundException('Product not found');
      return true;
    } catch (error) {
      if (this.isForeignKeyError(error)) {
        throw new ConflictException('Product cannot be deleted because it is referenced by an order');
      }
      throw error;
    }
  }

  private toGraphql<T extends { priceMinor: bigint }>(row: T) {
    return { ...row, priceMinor: row.priceMinor.toString() };
  }

  private isUniqueConstraintError(error: unknown): boolean {
    return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
  }

  private isForeignKeyError(error: unknown): boolean {
    return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003';
  }
}
