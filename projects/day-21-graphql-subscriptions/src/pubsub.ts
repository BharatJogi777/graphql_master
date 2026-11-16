type Listener<T> = (value: T) => void;

export class PubSub<T> {
  private readonly listeners = new Map<string, Set<Listener<T>>>();
  publish(topic: string, value: T) {
    for (const listener of this.listeners.get(topic) ?? []) listener(value);
  }
  subscribe(topic: string, listener: Listener<T>) {
    const listeners = this.listeners.get(topic) ?? new Set<Listener<T>>();
    listeners.add(listener);
    this.listeners.set(topic, listeners);
    return () => {
      listeners.delete(listener);
      if (listeners.size === 0) this.listeners.delete(topic);
    };
  }
  listenerCount(topic: string) { return this.listeners.get(topic)?.size ?? 0; }
}
