import { Field, ID, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
import { UserRole } from '@prisma/client';
import { IsEmail, IsOptional, IsString, Length, MaxLength } from 'class-validator';
import { Order } from '../orders/order.types';

registerEnumType(UserRole, { name: 'UserRole' });

@ObjectType()
export class Customer {
  @Field(() => ID)
  id!: string;

  @Field()
  email!: string;

  @Field()
  name!: string;

  @Field(() => UserRole)
  role!: UserRole;

  @Field()
  createdAt!: Date;

  @Field(() => [Order])
  orders!: Order[];
}

@InputType()
export class CreateCustomerInput {
  @Field()
  @IsEmail()
  @MaxLength(254)
  email!: string;

  @Field()
  @IsString()
  @Length(2, 120)
  name!: string;
}

@InputType()
export class UpdateCustomerInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  @MaxLength(254)
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(2, 120)
  name?: string;
}
