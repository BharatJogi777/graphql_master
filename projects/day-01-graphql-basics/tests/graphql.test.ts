import test from "node:test";
import assert from "node:assert/strict";
import { graphql } from "graphql";
import { resolvers } from "../src/resolvers.js";
import { typeDefs } from "../src/schema.js";
import { makeExecutableSchema } from "@graphql-tools/schema";

const schema = makeExecutableSchema({ typeDefs, resolvers });

test("fetches one order and its nested customer", async () => {
  const result = await graphql({
    schema,
    source: `
      query GetOrder($id: ID!) {
        order(id: $id) {
          id
          status
          totalAmount
          customer { id name }
        }
      }
    `,
    variableValues: { id: "ord-101" }
  });

  assert.equal(result.errors, undefined);
  assert.deepEqual(result.data, {
    order: {
      id: "ord-101",
      status: "CONFIRMED",
      totalAmount: 1499.5,
      customer: { id: "cus-1", name: "Asha Rao" }
    }
  });
});

test("returns all orders with their customer names", async () => {
  const result = await graphql({
    schema,
    source: `{ orders { id customer { name } } }`
  });

  assert.equal(result.errors, undefined);
  assert.equal(result.data?.orders instanceof Array, true);
  assert.equal((result.data?.orders as unknown[]).length, 3);
});

test("returns null when an order does not exist", async () => {
  const result = await graphql({
    schema,
    source: `{ order(id: "missing") { id } }`
  });

  assert.equal(result.errors, undefined);
  assert.deepEqual(result.data, { order: null });
});

test("resolves the reverse customer-to-orders relationship", async () => {
  const result = await graphql({
    schema,
    source: `{ customer(id: "cus-1") { name orders { id } } }`
  });

  assert.equal(result.errors, undefined);
  assert.deepEqual(result.data, {
    customer: {
      name: "Asha Rao",
      orders: [{ id: "ord-101" }, { id: "ord-102" }]
    }
  });
});
