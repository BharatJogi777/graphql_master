import test from "node:test";
import assert from "node:assert/strict";
import { ReplayEventBus } from "../src/event-bus.js";

test("replays only events after last event ID for the same tenant", () => {
  const bus = new ReplayEventBus<{ orderId: string }>();
  bus.publish("tenant-a", "ORDER_CHANGED", { orderId: "o-1" });
  bus.publish("tenant-b", "ORDER_CHANGED", { orderId: "o-2" });
  bus.publish("tenant-a", "ORDER_CHANGED", { orderId: "o-3" });
  const replay = bus.replayAfter(1, "tenant-a");
  assert.deepEqual(replay.map((event) => event.payload.orderId), ["o-3"]);
});

test("expired replay window asks client to resynchronize", () => {
  const bus = new ReplayEventBus<{ id: number }>(2);
  bus.publish("t", "X", { id: 1 });
  bus.publish("t", "X", { id: 2 });
  bus.publish("t", "X", { id: 3 });
  assert.throws(() => bus.replayAfter(0, "t"), /Replay window expired/);
});

test("live listener can unsubscribe", () => {
  const bus = new ReplayEventBus<{ value: number }>();
  const received: number[] = [];
  const unsubscribe = bus.listen("t", (event) => received.push(event.payload.value));
  bus.publish("t", "X", { value: 1 });
  unsubscribe();
  bus.publish("t", "X", { value: 2 });
  assert.deepEqual(received, [1]);
});

test("live listeners never receive another tenant's events", () => {
  const bus = new ReplayEventBus<{ value: string }>();
  const tenantA: string[] = [];
  const tenantB: string[] = [];
  bus.listen("tenant-a", (event) => tenantA.push(event.payload.value));
  bus.listen("tenant-b", (event) => tenantB.push(event.payload.value));
  bus.publish("tenant-a", "X", { value: "private-a" });
  bus.publish("tenant-b", "X", { value: "private-b" });
  assert.deepEqual(tenantA, ["private-a"]);
  assert.deepEqual(tenantB, ["private-b"]);
});

test("event IDs are monotonically increasing", () => {
  const bus = new ReplayEventBus<{}>();
  assert.deepEqual([bus.publish("t", "X", {}).id, bus.publish("t", "X", {}).id], [1, 2]);
});
