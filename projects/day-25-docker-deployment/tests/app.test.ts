import test from "node:test";
import assert from "node:assert/strict";
import { createApp } from "../src/main";

test("app exposes liveness and readiness endpoints", async () => {
  const { app, server } = await createApp();
  const http = app.listen(0);
  try {
    await new Promise<void>((resolve, reject) => {
      http.once("listening", resolve);
      http.once("error", reject);
    });
    const address = http.address();
    assert.ok(address && typeof address !== "string");
    const response = await fetch(`http://127.0.0.1:${address.port}/health/live`);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { status: "alive" });
  } finally {
    await new Promise<void>((resolve, reject) => {
      http.close((error) => error ? reject(error) : resolve());
    });
    await server.stop();
  }
});
