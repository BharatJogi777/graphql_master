import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import request from 'supertest';
import { ProductsModule } from '../src/products/products.module';
import { CustomersModule } from '../src/customers/customers.module';
import { OrdersModule } from '../src/orders/orders.module';
import { PrismaModule } from '../src/prisma/prisma.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { createRequestLoaders } from '../src/loaders/loaders';

describe('Commerce GraphQL API (e2e)', () => {
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
    order: {
      findMany: jest.fn().mockResolvedValue([]),
      findFirst: jest.fn(),
    },
    orderItem: {
      findMany: jest.fn().mockResolvedValue([]),
    },
  };

  beforeAll(async () => {
    const prisma = prismaMock as unknown as PrismaService;
    const moduleRef = await Test.createTestingModule({
      imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>({
          driver: ApolloDriver,
          autoSchemaFile: true,
          playground: false,
          context: () => ({
            req: undefined,
            res: undefined,
            loaders: createRequestLoaders(prisma),
          }),
        }),
        PrismaModule,
        ProductsModule,
        CustomersModule,
        OrdersModule,
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

  it('serves product and customer list queries', async () => {
    prismaMock.product.findMany.mockResolvedValue([]);
    prismaMock.user.findMany.mockResolvedValue([]);
    await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: '{ productsList { id name priceMinor } customersList { id email name role } }' })
      .expect(200)
      .expect(({ body }) => {
        expect(body.errors).toBeUndefined();
        expect(body.data.productsList).toEqual([]);
        expect(body.data.customersList).toEqual([]);
      });
  });

  it('creates a product and serializes bigint money as a string', async () => {
    prismaMock.product.create.mockResolvedValue({
      id: 'product-1', tenantId: 'demo-tenant', sku: 'SKU-1', name: 'Keyboard',
      description: null, priceMinor: 249900n, currency: 'INR', status: 'ACTIVE',
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
    });

    await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: 'mutation($input: CreateProductInput!) { createProduct(input: $input) { id sku priceMinor } }',
        variables: { input: { sku: 'SKU-1', name: 'Keyboard', priceMinor: '249900', currency: 'INR', status: 'ACTIVE' } },
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.errors).toBeUndefined();
        expect(body.data.createProduct).toEqual({ id: 'product-1', sku: 'SKU-1', priceMinor: '249900' });
      });
  });

  it('creates customers with the least-privileged role', async () => {
    prismaMock.user.create.mockResolvedValue({
      id: 'customer-1', tenantId: 'demo-tenant', email: 'customer@example.com',
      name: 'Example Customer', role: 'CUSTOMER', createdAt: new Date('2026-01-01T00:00:00.000Z'),
    });

    await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: 'mutation($input: CreateCustomerInput!) { createCustomer(input: $input) { id email name role } }',
        variables: { input: { email: 'CUSTOMER@example.com', name: 'Example Customer' } },
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.errors).toBeUndefined();
        expect(body.data.createCustomer).toMatchObject({
          id: 'customer-1', email: 'customer@example.com', name: 'Example Customer', role: 'CUSTOMER',
        });
      });
  });

  it('resolves nested order -> customer -> items -> product with batched relation loaders', async () => {
    prismaMock.order.findMany.mockResolvedValue([{
      id: 'order-1', tenantId: 'demo-tenant', userId: 'customer-1', status: 'PAID',
      totalMinor: 249900n, currency: 'INR', createdAt: new Date('2026-01-01T00:00:00.000Z'),
    }]);
    prismaMock.user.findMany.mockResolvedValue([{
      id: 'customer-1', tenantId: 'demo-tenant', email: 'customer@example.com',
      name: 'Customer', role: 'CUSTOMER', createdAt: new Date('2026-01-01T00:00:00.000Z'),
    }]);
    prismaMock.orderItem.findMany.mockResolvedValue([{
      id: 'item-1', tenantId: 'demo-tenant', orderId: 'order-1',
      productId: 'product-1', quantity: 1, unitPriceMinor: 249900n,
    }]);
    prismaMock.product.findMany.mockResolvedValue([{
      id: 'product-1', tenantId: 'demo-tenant', sku: 'SKU-1', name: 'Keyboard',
      description: null, priceMinor: 249900n, currency: 'INR', status: 'ACTIVE',
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
    }]);

    await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: '{ ordersList { id totalMinor customer { name } items { quantity unitPriceMinor product { sku name priceMinor } } } }',
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.errors).toBeUndefined();
        expect(body.data.ordersList[0]).toMatchObject({
          id: 'order-1',
          totalMinor: '249900',
          customer: { name: 'Customer' },
          items: [{ quantity: 1, unitPriceMinor: '249900', product: { sku: 'SKU-1', name: 'Keyboard', priceMinor: '249900' } }],
        });
      });

    expect(prismaMock.user.findMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.orderItem.findMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.product.findMany).toHaveBeenCalledTimes(1);
  });
});
