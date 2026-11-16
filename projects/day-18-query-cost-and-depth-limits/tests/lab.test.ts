import test from "node:test";
import assert from "node:assert/strict";
import { analyzeQuery, execute } from "../src/lab.js";

test("small query passes depth and cost limits", () => {
  const result = analyzeQuery("{ health }");
  assert.equal(result.allowed, true);
  assert.equal(result.depth, 1);
});

test("deeply nested query is rejected", () => {
  const result = analyzeQuery("{ products { reviews { author } } }", 2, 100);
  assert.equal(result.allowed, false);
  assert.ok(result.errors[0]?.includes("depth"));
});

test("invalid fields are rejected before cost analysis", () => {
  const result = analyzeQuery("{ products { doesNotExist } }");
  assert.equal(result.allowed, false);
  assert.ok(result.errors.some((error) => error.includes("doesNotExist")));
});

test("executor does not execute a query rejected by limits", async () => {
  const result = await execute("{ products { reviews { author } } }");
  assert.ok(result.errors?.length);
  assert.equal(result.data, undefined);
});
