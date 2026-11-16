import { Field, ID, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
import { ProductStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString, Length, Matches, MaxLength, MinLength } from 'class-validator';

registerEnumType(ProductStatus, { name: 'ProductStatus' });

@ObjectType()
export class Product {
  @Field(() => ID)
  id!: string;

  @Field()
  sku!: string;

  @Field()
  name!: string;

  @Field({ nullable: true })
  description!: string | null;

  /** Integer minor units serialized as a string to avoid GraphQL Int and JS float limits. */
  @Field()
  priceMinor!: string;

  @Field()
  currency!: string;

  @Field(() => ProductStatus)
  status!: ProductStatus;

  @Field()
  createdAt!: Date;
}

@InputType()
export class CreateProductInput {
  @Field()
  @IsString()
  @Length(2, 64)
  sku!: string;

  @Field()
  @IsString()
  @Length(2, 160)
  name!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @Field()
  @IsString()
  @Matches(/^(0|[1-9][0-9]{0,17})$/, { message: 'priceMinor must be a non-negative integer string' })
  priceMinor!: string;

  @Field({ defaultValue: 'INR' })
  @IsString()
  @Matches(/^[A-Z]{3}$/)
  currency = 'INR';

  @Field(() => ProductStatus, { defaultValue: ProductStatus.DRAFT })
  @IsEnum(ProductStatus)
  status = ProductStatus.DRAFT;
}

@InputType()
export class UpdateProductInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(2, 160)
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string | null;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Matches(/^(0|[1-9][0-9]{0,17})$/)
  priceMinor?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Matches(/^[A-Z]{3}$/)
  currency?: string;

  @Field(() => ProductStatus, { nullable: true })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;
}
