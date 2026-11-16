export type DomainEvent<T> = { id: number; tenantId: string; type: string; payload: T; occurredAt: string };

export class ReplayEventBus<T> {
  private sequence = 0;
  private readonly history: DomainEvent<T>[] = [];
  private readonly listeners = new Map<string, Set<(event: DomainEvent<T>) => void>>();
  constructor(private readonly maxHistory = 100) {
    if (!Number.isInteger(maxHistory) || maxHistory < 1) {
      throw new Error("maxHistory must be a positive integer");
    }
  }

  publish(tenantId: string, type: string, payload: T): DomainEvent<T> {
    const event = { id: ++this.sequence, tenantId, type, payload, occurredAt: new Date().toISOString() };
    this.history.push(event);
    if (this.history.length > this.maxHistory) this.history.shift();
    // Live delivery is tenant-scoped just like replay; callers cannot accidentally
    // receive another tenant's event by registering a global listener.
    for (const listener of this.listeners.get(tenantId) ?? []) listener(event);
    return event;
  }

  replayAfter(lastEventId: number, tenantId: string) {
    const earliest = this.history[0]?.id ?? this.sequence + 1;
    if (lastEventId < earliest - 1) throw new Error("Replay window expired; client must resynchronize");
    return this.history.filter((event) => event.id > lastEventId && event.tenantId === tenantId);
  }

  listen(tenantId: string, listener: (event: DomainEvent<T>) => void) {
    const tenantListeners = this.listeners.get(tenantId) ?? new Set<(event: DomainEvent<T>) => void>();
    tenantListeners.add(listener);
    this.listeners.set(tenantId, tenantListeners);
    return () => {
      tenantListeners.delete(listener);
      if (tenantListeners.size === 0) this.listeners.delete(tenantId);
    };
  }
}
