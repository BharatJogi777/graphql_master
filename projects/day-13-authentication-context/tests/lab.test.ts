import test from "node:test";
import assert from "node:assert/strict";
import { authenticate, execute } from "../src/lab.js";

test("authentication maps a valid demo bearer token to a principal", () => {
  assert.equal(authenticate("Bearer u-1")?.email, "asha@example.test");
});

test("invalid or absent credentials produce no principal", () => {
  assert.equal(authenticate(undefined), null);
  assert.equal(authenticate("Bearer unknown"), null);
});

test("public fields remain available anonymously", async () => {
  const result = await execute("{ publicMessage }");
  assert.deepEqual(result.data, { publicMessage: "This field is public" });
});

test("protected field returns stable UNAUTHENTICATED error", async () => {
  const result = await execute("{ viewer { id } }");
  assert.equal(result.errors?.[0]?.extensions.code, "UNAUTHENTICATED");
});

test("authenticated request receives its request principal", async () => {
  const result = await execute("{ viewer { id email } }", "Bearer u-1");
  assert.deepEqual(result.data, { viewer: { id: "u-1", email: "asha@example.test" } });
});
