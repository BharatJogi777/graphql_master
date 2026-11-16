import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
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
}
