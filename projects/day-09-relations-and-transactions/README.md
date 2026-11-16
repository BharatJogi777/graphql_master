# Day 09 — Relations and Transactions

## Goal
Model a customer-order-product graph and create an order with atomic inventory reservation and idempotency.

## Start
```bash
cp .env.example .env
docker compose up -d
npm install
npm run db:generate
npm run db:migrate -- --name init
npm run db:seed
npm test
npm run typecheck
```

PostgreSQL uses host port **5438**. Integration tests require the database to be migrated.

## Study
- Customer has many Orders; Order has many OrderItems; each OrderItem references one Product.
- `OrderItem.unitPriceMinor` snapshots the price at purchase time.
- The service checks customer and products, reserves stock, and creates the order inside one serializable transaction.
- Conditional `updateMany` prevents inventory from going negative under concurrent updates.
- The unique idempotency key prevents retries from creating duplicate orders.

## Practice
1. Add a cancellation workflow that restores inventory exactly once.
2. Add a maximum order quantity and test it.
3. Simulate two concurrent orders competing for the last units.
4. Handle Prisma serialization conflicts with bounded retries and jitter.
5. Add an outbox row in the same transaction for reliable downstream events.

## Production note
A transaction alone does not solve every concurrency problem. Use database constraints, conditional writes, idempotency keys and a deliberate retry policy. Never trust a price supplied by the client; calculate it from persisted product data.
