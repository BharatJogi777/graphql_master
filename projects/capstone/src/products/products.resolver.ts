import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Product, CreateProductInput, UpdateProductInput } from './product.types';
import { ProductsService } from './products.service';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(private readonly products: ProductsService) {}

  @Query(() => [Product])
  productsList() {
    return this.products.findAll();
  }

  @Query(() => Product)
  product(@Args('id', { type: () => ID }) id: string) {
    return this.products.findById(id);
  }

  @Mutation(() => Product)
  createProduct(@Args('input') input: CreateProductInput) {
    return this.products.create(input);
  }

  @Mutation(() => Product)
  updateProduct(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateProductInput,
  ) {
    return this.products.update(id, input);
  }

  @Mutation(() => Boolean)
  deleteProduct(@Args('id', { type: () => ID }) id: string) {
    return this.products.remove(id);
  }

  // Loader results are raw Prisma rows (BigInt); service results are already
  // strings. String() safely handles both paths and keeps the GraphQL contract stable.
  @ResolveField('priceMinor', () => String)
  priceMinor(@Parent() product: { priceMinor: bigint | string }) {
    return product.priceMinor.toString();
  }
}
