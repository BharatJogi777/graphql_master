import { Args, Context, ID, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Customer, CreateCustomerInput, UpdateCustomerInput } from './customer.types';
import { CustomersService } from './customers.service';
import { Order } from '../orders/order.types';
import { GraphqlContext } from '../loaders/loaders.types';

@Resolver(() => Customer)
export class CustomersResolver {
  constructor(private readonly customers: CustomersService) {}

  @Query(() => [Customer])
  customersList() {
    return this.customers.findAll();
  }

  @Query(() => Customer)
  customer(@Args('id', { type: () => ID }) id: string) {
    return this.customers.findById(id);
  }

  @Mutation(() => Customer)
  createCustomer(@Args('input') input: CreateCustomerInput) {
    return this.customers.create(input);
  }

  @Mutation(() => Customer)
  updateCustomer(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateCustomerInput,
  ) {
    return this.customers.update(id, input);
  }

  @Mutation(() => Boolean)
  deleteCustomer(@Args('id', { type: () => ID }) id: string) {
    return this.customers.remove(id);
  }

  @ResolveField('orders', () => [Order])
  orders(@Parent() customer: { id: string }, @Context() context: GraphqlContext) {
    return context.loaders.ordersByCustomerId.load(customer.id);
  }
}
