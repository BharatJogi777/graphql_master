import { ReplayEventBus, type DomainEvent } from "./event-bus.js";

export type OrderChanged = { orderId: string; status: "PAID" | "CANCELLED" };
export const bus = new ReplayEventBus<OrderChanged>(3);

export function publishOrderChanged(tenantId: string, payload: OrderChanged) {
  return bus.publish(tenantId, "ORDER_CHANGED", payload);
}
export function resumeOrderEvents(lastEventId: number, tenantId: string): DomainEvent<OrderChanged>[] {
  return bus.replayAfter(lastEventId, tenantId);
}
