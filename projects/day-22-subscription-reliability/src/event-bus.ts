export type DomainEvent<T> = { id: number; tenantId: string; type: string; payload: T; occurredAt: string };

export class ReplayEventBus<T> {
  private sequence = 0;
  private readonly history: DomainEvent<T>[] = [];
  private readonly listeners = new Set<(event: DomainEvent<T>) => void>();
  constructor(private readonly maxHistory = 100) {}

  publish(tenantId: string, type: string, payload: T): DomainEvent<T> {
    const event = { id: ++this.sequence, tenantId, type, payload, occurredAt: new Date().toISOString() };
    this.history.push(event);
    if (this.history.length > this.maxHistory) this.history.shift();
    for (const listener of this.listeners) listener(event);
    return event;
  }

  replayAfter(lastEventId: number, tenantId: string) {
    const earliest = this.history[0]?.id ?? this.sequence + 1;
    if (lastEventId < earliest - 1) throw new Error("Replay window expired; client must resynchronize");
    return this.history.filter((event) => event.id > lastEventId && event.tenantId === tenantId);
  }

  listen(listener: (event: DomainEvent<T>) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}
