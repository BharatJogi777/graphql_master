import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('live')
  live() {
    return { status: 'ok' as const };
  }

  @Get('ready')
  async ready() {
    await this.prisma.$queryRaw`SELECT 1`;
    return { status: 'ok' as const, dependencies: { database: 'ok' as const } };
  }
}
