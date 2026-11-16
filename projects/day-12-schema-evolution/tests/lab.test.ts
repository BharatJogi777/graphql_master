import test from "node:test";
import assert from "node:assert/strict";
import { execute, oldSchema, evolvedSchema, validateAgainst } from "../src/lab.js";

test("existing client selection remains valid after additive evolution", () => {
  const errors = validateAgainst(evolvedSchema, `{ user(id: "u-1") { id name } }`);
  assert.equal(errors.length, 0);
});

test("new clients can use the additive field", async () => {
  const result = await execute(`{ user(id: "u-1") { displayName } }`);
  assert.deepEqual(result.data, { user: { displayName: "Asha J." } });
});

test("legacy field remains queryable while marked deprecated", async () => {
  const result = await execute(`{ user(id: "u-1") { legacyName } }`);
  assert.deepEqual(result.data, { user: { legacyName: "Asha" } });
  const field = evolvedSchema.getType("User")?.getFields().legacyName;
  assert.equal(field?.deprecationReason, "Use displayName instead.");
});

test("removing a field is a breaking change for old operations", () => {
  const oldOperation = `{ user(id: "u-1") { id name } }`;
  assert.equal(validateAgainst(oldSchema, oldOperation).length, 0);
  const breakingSchema = buildBreakingSchema();
  assert.ok(validateAgainst(breakingSchema, oldOperation).length > 0);
});

function buildBreakingSchema() {
  return (awaitlessBuildSchema)(`
    type User { id: ID!, displayName: String! }
    type Query { user(id: ID!): User }
  `);
}
import { buildSchema as awaitlessBuildSchema } from "graphql";
