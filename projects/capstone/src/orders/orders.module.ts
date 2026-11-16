import { Module } from '@nestjs/common';
import { OrdersResolver, OrderItemResolver } from './orders.resolver';
import { OrdersService } from './orders.service';

@Module({
  providers: [OrdersResolver, OrderItemResolver, OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
