import { performance } from "node:perf_hooks";

export type ResolverMetric = { field: string; durationMs: number; outcome: "success" | "error" };
export class ResolverTelemetry {
  readonly metrics: ResolverMetric[] = [];
  async measure<T>(field: string, operation: () => Promise<T> | T): Promise<T> {
    const started = performance.now();
    try {
      const result = await operation();
      this.metrics.push({ field, durationMs: performance.now() - started, outcome: "success" });
      return result;
    } catch (error) {
      this.metrics.push({ field, durationMs: performance.now() - started, outcome: "error" });
      throw error;
    }
  }
  summary() {
    const grouped = new Map<string, ResolverMetric[]>();
    for (const metric of this.metrics) grouped.set(metric.field, [...(grouped.get(metric.field) ?? []), metric]);
    return [...grouped].map(([field, rows]) => ({
      field,
      calls: rows.length,
      errors: rows.filter((row) => row.outcome === "error").length,
      averageDurationMs: rows.reduce((sum, row) => sum + row.durationMs, 0) / rows.length
    }));
  }
}
