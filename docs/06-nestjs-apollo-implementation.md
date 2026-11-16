
# 06 — NestJS + Apollo Implementation Guide

Use the current official NestJS GraphQL integration and Apollo docs for compatible package versions. NestJS supports code-first and schema-first approaches; this course uses code-first decorators first and requires understanding SDL/schema-first too.

## Project setup
Create a NestJS application using the current CLI. Install compatible NestJS GraphQL integration, Apollo driver/server, GraphQL runtime, PostgreSQL driver, Prisma and Jest packages. Pin versions and commit the lockfile; do not combine examples from incompatible major releases.

## Suggested structure
~~~~text
src/
  main.ts
  app.module.ts
  config/
  common/auth/
  common/errors/
  common/scalars/
  common/pagination/
  database/prisma.module.ts
  database/prisma.service.ts
  graphql/context/
  graphql/loaders/
  modules/users/{users.module.ts,users.resolver.ts,users.service.ts,users.repository.ts}
  modules/products/{products.module.ts,products.resolver.ts,products.service.ts,products.repository.ts}
  modules/orders/{orders.module.ts,orders.resolver.ts,orders.service.ts,orders.repository.ts}
test/{unit,integration,e2e}/
prisma/{schema.prisma,migrations,seed.ts}
~~~~

## Build sequence
1. Configure GraphQL driver and schema generation.
2. Add health/readiness probes as required by platform.
3. Define Product object type and Query resolver.
4. Add service/repository and NestJS DI.
5. Add Prisma/PostgreSQL and migrations.
6. Add mutation input types and validation.
7. Add User/Order relations.
8. Add request context and authentication.
9. Add request-scoped DataLoaders.
10. Add safe errors, logs and plugins.
11. Add integration and E2E tests.
12. Add query limits and deployment config.

## Representative code-first pattern
~~~~ts
@ObjectType()
export class Product {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;
}

@Resolver(() => Product)
export class ProductsResolver {
  constructor(private readonly products: ProductsService) {}

  @Query(() => Product, { nullable: true })
  product(@Args('id', { type: () => ID }) id: string) {
    return this.products.findById(id);
  }
}
~~~~
This is a teaching fragment, not a complete production resolver. Add authorization, validation, telemetry and tests.

## Configuration and practical assignment
Validate required environment variables at startup. Keep secrets out of source control/logs. Separate local/test/production config. Bound DB pools and timeouts. Define CORS/cookie/CSRF behavior. Protect interactive tooling in production. Configure graceful shutdown.

Build project skeleton, boot GraphQL, implement Product query/mutation backed by PostgreSQL and add E2E tests. Document exact versions and setup commands in your project README.

Acceptance: a new developer can clone, configure, start dependencies, migrate, start server and execute a tested query.
