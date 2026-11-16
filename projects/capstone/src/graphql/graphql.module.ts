import { Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { GraphqlResolver } from './graphql.resolver';
import { ProductsModule } from '../products/products.module';
import { CustomersModule } from '../customers/customers.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
      playground: false,
      introspection: process.env.GRAPHQL_INTROSPECTION !== 'false',
      context: ({ req, res }) => ({ req, res }),
    }),
    ProductsModule,
    CustomersModule,
  ],
  providers: [GraphqlResolver],
})
export class GraphqlApiModule {}
