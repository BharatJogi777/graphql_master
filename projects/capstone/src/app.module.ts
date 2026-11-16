import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { GraphqlApiModule } from './graphql/graphql.module';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),
        PORT: Joi.number().port().default(3000),
        DATABASE_URL: Joi.string().uri({ scheme: ['postgresql', 'postgres'] }).required(),
        GRAPHQL_INTROSPECTION: Joi.boolean().default(true),
      }),
    }),
    PrismaModule,
    GraphqlApiModule,
    HealthModule,
  ],
})
export class AppModule {}
