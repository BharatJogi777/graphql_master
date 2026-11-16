import test from "node:test";
import assert from "node:assert/strict";
import { loadConfig } from "../src/config.js";
import { publicGraphQLError } from "../src/errors.js";
import { GraphQLError } from "graphql";

test("config parses validated settings", () => {
  const config = loadConfig({ NODE_ENV: "test", PORT: "4100", DATABASE_URL: "postgresql://localhost/test", JWT_SECRET: "secret" });
  assert.equal(config.port, 4100);
  assert.equal(config.corsOrigins.length, 0);
});

test("production requires strong secret and explicit CORS allowlist", () => {
  assert.throws(() => loadConfig({ NODE_ENV: "production", DATABASE_URL: "postgresql://localhost/db", JWT_SECRET: "short" }), /32 characters/);
  assert.throws(() => loadConfig({ NODE_ENV: "production", DATABASE_URL: "postgresql://localhost/db", JWT_SECRET: "x".repeat(40) }), /CORS_ORIGINS/);
});

test("invalid port and missing database URL fail fast", () => {
  assert.throws(() => loadConfig({ PORT: "70000", DATABASE_URL: "x", JWT_SECRET: "x" }), /TCP port/);
  assert.throws(() => loadConfig({ JWT_SECRET: "x" }), /DATABASE_URL/);
});

test("known safe error code is retained", () => {
  const result = publicGraphQLError(new GraphQLError("Invalid input", { extensions: { code: "BAD_USER_INPUT" } }));
  assert.deepEqual(result, { message: "Invalid input", extensions: { code: "BAD_USER_INPUT" } });
});

test("INTERNAL_SERVER_ERROR GraphQLErrors are sanitized even when explicitly coded", () => {
  const result = publicGraphQLError(new GraphQLError("database password leaked", { extensions: { code: "INTERNAL_SERVER_ERROR" } }));
  assert.deepEqual(result, { message: "An unexpected error occurred", extensions: { code: "INTERNAL_SERVER_ERROR" } });
});

test("unknown errors are sanitized", () => {
  const result = publicGraphQLError(new Error("postgres://secret-host/password"));
  assert.equal(result.message, "An unexpected error occurred");
  assert.equal(result.extensions.code, "INTERNAL_SERVER_ERROR");
});
