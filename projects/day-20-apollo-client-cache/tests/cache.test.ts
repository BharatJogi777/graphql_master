import test from "node:test";
import assert from "node:assert/strict";
import { gql } from "@apollo/client/core";
import { createCache } from "../src/cache.js";

const PRODUCT = gql`fragment ProductFields on Product { id name priceMinor }`;
const PRODUCTS = gql`query Products($status: String, $offset: Int) { products(status: $status, offset: $offset) { id name priceMinor } }`;

test("normalized entities are shared by ID across query results", () => {
  const cache = createCache();
  cache.writeFragment({ id: "Product:p-1", fragment: PRODUCT, data: { __typename: "Product", id: "p-1", name: "Keyboard", priceMinor: 7999 } });
  const result = cache.readFragment({ id: "Product:p-1", fragment: PRODUCT });
  assert.equal(result?.name, "Keyboard");
});

test("field key arguments isolate different filters", () => {
  const cache = createCache();
  cache.writeQuery({ query: PRODUCTS, variables: { status: "ACTIVE", offset: 0 }, data: { products: [{ __typename: "Product", id: "p-1", name: "A", priceMinor: 1 }] } });
  cache.writeQuery({ query: PRODUCTS, variables: { status: "DRAFT", offset: 0 }, data: { products: [{ __typename: "Product", id: "p-2", name: "B", priceMinor: 2 }] } });
  assert.equal(cache.readQuery({ query: PRODUCTS, variables: { status: "ACTIVE", offset: 0 } })?.products[0].id, "p-1");
  assert.equal(cache.readQuery({ query: PRODUCTS, variables: { status: "DRAFT", offset: 0 } })?.products[0].id, "p-2");
});
