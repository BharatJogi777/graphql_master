import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';
import { DEMO_TENANT_ID } from '../common/tenant-scope';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerInput, UpdateCustomerInput } from './customer.types';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany({
      where: { tenantId: DEMO_TENANT_ID },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    const customer = await this.prisma.user.findFirst({
      where: { id, tenantId: DEMO_TENANT_ID },
    });
    if (!customer) throw new NotFoundException('Customer not found');
    return customer;
  }

  async create(input: CreateCustomerInput) {
    try {
      return await this.prisma.user.create({
        data: {
          tenantId: DEMO_TENANT_ID,
          email: input.email.toLowerCase(),
          name: input.name,
          // Public customer creation must never grant an elevated role.
          role: UserRole.CUSTOMER,
        },
      });
    } catch (error) {
      if (this.isUniqueConstraintError(error)) {
        throw new ConflictException('A customer with this email already exists');
      }
      throw error;
    }
  }

  async update(id: string, input: UpdateCustomerInput) {
    const data: Prisma.UserUpdateManyMutationInput = {
      ...(input.email !== undefined ? { email: input.email.toLowerCase() } : {}),
      ...(input.name !== undefined ? { name: input.name } : {}),
    };
    try {
      const result = await this.prisma.user.updateMany({
        where: { id, tenantId: DEMO_TENANT_ID },
        data,
      });
      if (result.count === 0) throw new NotFoundException('Customer not found');
      return this.findById(id);
    } catch (error) {
      if (this.isUniqueConstraintError(error)) {
        throw new ConflictException('A customer with this email already exists');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      const result = await this.prisma.user.deleteMany({
        where: { id, tenantId: DEMO_TENANT_ID },
      });
      if (result.count === 0) throw new NotFoundException('Customer not found');
      return true;
    } catch (error) {
      if (this.isForeignKeyError(error)) {
        throw new ConflictException('Customer cannot be deleted while orders reference this customer');
      }
      throw error;
    }
  }

  private isUniqueConstraintError(error: unknown): boolean {
    return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
  }

  private isForeignKeyError(error: unknown): boolean {
    return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003';
  }
}
