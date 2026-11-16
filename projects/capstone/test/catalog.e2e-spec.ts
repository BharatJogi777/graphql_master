import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import request from 'supertest';
import { ProductsModule } from '../src/products/products.module';
import { CustomersModule } from '../src/customers/customers.module';
import { PrismaModule } from '../src/prisma/prisma.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Catalog GraphQL API (e2e)', () => {
  let app: INestApplication;
  const prismaMock = {
    product: {
      findMany: jest.fn().mockResolvedValue([]),
      findFirst: jest.fn(),
      create: jest.fn(),
      updateMany: jest.fn(),
      deleteMany: jest.fn(),
    },
    user: {
      findMany: jest.fn().mockResolvedValue([]),
      findFirst: jest.fn(),
      create: jest.fn(),
      updateMany: jest.fn(),
      deleteMany: jest.fn(),
    },
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>({
          driver: ApolloDriver,
          autoSchemaFile: true,
          playground: false,
        }),
        PrismaModule,
        ProductsModule,
        CustomersModule,
      ],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaMock)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => app.close());

  beforeEach(() => jest.clearAllMocks());

  it('serves a products query', async () => {
    prismaMock.product.findMany.mockResolvedValue([]);
    await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: '{ productsList { id name priceMinor } }' })
      .expect(200)
      .expect(({ body }) => {
        expect(body.errors).toBeUndefined();
        expect(body.data.productsList).toEqual([]);
      });
  });

  it('serves a customers query', async () => {
    prismaMock.user.findMany.mockResolvedValue([]);
    await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: '{ customersList { id email name role } }' })
      .expect(200)
      .expect(({ body }) => {
        expect(body.errors).toBeUndefined();
        expect(body.data.customersList).toEqual([]);
      });
  });

  it('creates a product through GraphQL and serializes bigint money', async () => {
    prismaMock.product.create.mockResolvedValue({
      id: 'product-1',
      tenantId: 'demo-tenant',
      sku: 'SKU-1',
      name: 'Keyboard',
      description: null,
      priceMinor: 249900n,
      currency: 'INR',
      status: 'ACTIVE',
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
    });

    await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: 'mutation($input: CreateProductInput!) { createProduct(input: $input) { id sku priceMinor } }',
        variables: {
          input: {
            sku: 'SKU-1',
            name: 'Keyboard',
            priceMinor: '249900',
            currency: 'INR',
            status: 'ACTIVE',
          },
        },
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.errors).toBeUndefined();
        expect(body.data.createProduct).toEqual({
          id: 'product-1',
          sku: 'SKU-1',
          priceMinor: '249900',
        });
      });
  });

  it('creates a customer through GraphQL without accepting a role override', async () => {
    prismaMock.user.create.mockResolvedValue({
      id: 'customer-1',
      tenantId: 'demo-tenant',
      email: 'customer@example.com',
      name: 'Example Customer',
      role: 'CUSTOMER',
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
    });

    await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: 'mutation($input: CreateCustomerInput!) { createCustomer(input: $input) { id email name role } }',
        variables: {
          input: {
            email: 'CUSTOMER@example.com',
            name: 'Example Customer',
          },
        },
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.errors).toBeUndefined();
        expect(body.data.createCustomer).toMatchObject({
          id: 'customer-1',
          email: 'customer@example.com',
          name: 'Example Customer',
          role: 'CUSTOMER',
        });
      });
  });
});
