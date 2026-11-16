import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const deployment = readFileSync(new URL("../k8s/deployment.yaml", import.meta.url), "utf8");
const service = readFileSync(new URL("../k8s/service.yaml", import.meta.url), "utf8");
const hpa = readFileSync(new URL("../k8s/hpa.yaml", import.meta.url), "utf8");

test("deployment declares readiness and liveness probes", () => {
  assert.match(deployment, /readinessProbe:/);
  assert.match(deployment, /livenessProbe:/);
});

test("deployment references secret rather than hardcoding database credentials", () => {
  assert.match(deployment, /secretKeyRef:/);
  assert.doesNotMatch(deployment, /postgres://[^\s]+:[^\s]+@/);
});

test("service selects the application pods", () => {
  assert.match(service, /app: graphql-api/);
  assert.match(service, /targetPort: http/);
});

test("HPA has bounded replica count and CPU target", () => {
  assert.match(hpa, /minReplicas: 3/);
  assert.match(hpa, /maxReplicas: 12/);
  assert.match(hpa, /averageUtilization: 70/);
});
