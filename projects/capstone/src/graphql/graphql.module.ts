import { Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { GraphqlResolver } from './graphql.resolver';

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
  ],
  providers: [GraphqlResolver],
})
export class GraphqlApiModule {}
