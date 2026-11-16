import { Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { GraphqlResolver } from './graphql.resolver';
import { ProductsModule } from '../products/products.module';
import { CustomersModule } from '../customers/customers.module';
import { OrdersModule } from '../orders/orders.module';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';
import { createRequestLoaders } from '../loaders/loaders';

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      imports: [PrismaModule],
      inject: [PrismaService],
      useFactory: (prisma: PrismaService) => ({
        driver: ApolloDriver,
        autoSchemaFile: true,
        sortSchema: true,
        playground: false,
        introspection: process.env.GRAPHQL_INTROSPECTION !== 'false',
        context: ({ req, res }) => ({
          req,
          res,
          loaders: createRequestLoaders(prisma),
        }),
      }),
    }),
    ProductsModule,
    CustomersModule,
    OrdersModule,
  ],
  providers: [GraphqlResolver],
})
export class GraphqlApiModule {}
