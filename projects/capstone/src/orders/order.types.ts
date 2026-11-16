import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { OrderStatus } from '@prisma/client';
import { Customer } from '../customers/customer.types';
import { Product } from '../products/product.types';

registerEnumType(OrderStatus, { name: 'OrderStatus' });

@ObjectType()
export class OrderItem {
  @Field(() => ID)
  id!: string;

  @Field()
  quantity!: number;

  @Field()
  unitPriceMinor!: string;

  @Field(() => Product)
  product!: Product;
}

@ObjectType()
export class Order {
  @Field(() => ID)
  id!: string;

  @Field(() => OrderStatus)
  status!: OrderStatus;

  @Field()
  totalMinor!: string;

  @Field()
  currency!: string;

  @Field()
  createdAt!: Date;

  @Field(() => Customer)
  customer!: Customer;

  @Field(() => [OrderItem])
  items!: OrderItem[];
}
