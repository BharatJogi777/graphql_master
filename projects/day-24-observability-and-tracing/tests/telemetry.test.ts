import test from "node:test";
import assert from "node:assert/strict";
import { telemetry, execute } from "../src/lab.js";

test("records successful resolver calls", async () => {
  await execute("{ health }");
  const metric = telemetry.summary().find((item) => item.field === "Query.health");
  assert.equal(metric?.calls, 1);
  assert.equal(metric?.errors, 0);
});

test("records resolver errors without swallowing them", async () => {
  const result = await execute('{ product(id:"missing") { id } }');
  assert.ok(result.errors?.length);
  const metric = telemetry.summary().find((item) => item.field === "Query.product");
  assert.equal(metric?.errors, 1);
});

test("telemetry summary includes average duration", async () => {
  await execute('{ product(id:"p-1") { name } }');
  const metric = telemetry.summary().find((item) => item.field === "Query.product");
  assert.ok(typeof metric?.averageDurationMs === "number");
});
