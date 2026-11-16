import test from "node:test";
import assert from "node:assert/strict";
import { AppResolver } from "../src/app.resolver";

test("hello query resolver returns a greeting", () => {
  const resolver = new AppResolver();
  assert.equal(resolver.hello(), "Hello from NestJS GraphQL");
});

test("products resolver returns the catalog", () => {
  const resolver = new AppResolver();
  assert.equal(resolver.products().length, 2);
});

test("product resolver returns null for an unknown ID", () => {
  const resolver = new AppResolver();
  assert.equal(resolver.product("missing"), null);
});
