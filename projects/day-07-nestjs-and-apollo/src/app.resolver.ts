import { Args, Field, ID, Int, ObjectType, Query, Resolver } from "@nestjs/graphql";

@ObjectType()
export class Product {
  @Field(() => ID) id!: string;
  @Field() name!: string;
  @Field(() => Int) priceMinor!: number;
}

const catalog: Product[] = [
  Object.assign(new Product(), { id: "p-1", name: "Keyboard", priceMinor: 7999 }),
  Object.assign(new Product(), { id: "p-2", name: "USB-C Hub", priceMinor: 3499 })
];

@Resolver(() => Product)
export class AppResolver {
  @Query(() => String)
  hello(): string { return "Hello from NestJS GraphQL"; }

  @Query(() => [Product])
  products(): Product[] { return catalog; }

  @Query(() => Product, { nullable: true })
  product(@Args("id", { type: () => ID }) id: string): Product | null {
    return catalog.find((item) => item.id === id) ?? null;
  }
}
