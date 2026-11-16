import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class GraphqlResolver {
  @Query(() => String, { description: 'Basic API status query used to verify GraphQL execution.' })
  apiStatus(): string {
    return 'GraphQL API is ready';
  }
}
