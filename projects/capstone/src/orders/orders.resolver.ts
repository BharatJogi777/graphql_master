import { Args, Context, ID, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Order, OrderItem } from './order.types';
import { OrdersService } from './orders.service';
import { GraphqlContext } from '../loaders/loaders.types';
import { Product } from '../products/product.types';
import { Customer } from '../customers/customer.types';

@Resolver(() => Order)
export class OrdersResolver {
  constructor(private readonly orders: OrdersService) {}

  @Query(() => [Order])
  ordersList() {
    return this.orders.findAll();
  }

  @Query(() => Order)
  order(@Args('id', { type: () => ID }) id: string) {
    return this.orders.findById(id);
  }

  @ResolveField('totalMinor', () => String)
  totalMinor(@Parent() order: { totalMinor: bigint | string }) {
    return order.totalMinor.toString();
  }

  @ResolveField('customer', () => Customer)
  customer(@Parent() order: { userId: string }, @Context() context: GraphqlContext) {
    return context.loaders.customerById.load(order.userId);
  }

  @ResolveField('items', () => [OrderItem])
  items(@Parent() order: { id: string }, @Context() context: GraphqlContext) {
    return context.loaders.orderItemsByOrderId.load(order.id);
  }
}

@Resolver(() => OrderItem)
export class OrderItemResolver {
  @ResolveField('product', () => Product)
  product(@Parent() item: { productId: string }, @Context() context: GraphqlContext) {
    return context.loaders.productById.load(item.productId);
  }

  @ResolveField('unitPriceMinor', () => String)
  unitPriceMinor(@Parent() item: { unitPriceMinor: bigint }) {
    return item.unitPriceMinor.toString();
  }
}
