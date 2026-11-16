# Day 26 — Kubernetes Production Manifests

## Goal
Deploy a GraphQL API with health probes, resource requests/limits, secret references, service discovery and autoscaling.

## Validate
```bash
npm install
npm test
npm run typecheck
kubectl apply --dry-run=client -f k8s/
```

Replace the illustrative image registry and create the `graphql-api-secrets` Secret through your approved secret-management workflow before deployment.

## Study
- Readiness controls whether a pod receives traffic; liveness controls whether it is restarted.
- Requests influence scheduling; limits cap resource consumption.
- HPA scales replicas based on observed metrics.
- Services provide stable in-cluster discovery.
- Secrets should not be committed as plaintext YAML.

## Practice
1. Add a PodDisruptionBudget and topology spread constraints.
2. Add NetworkPolicy and least-privilege ServiceAccount.
3. Add a rolling deployment strategy and rollback runbook.
4. Configure ingress/TLS and request-size limits.
5. Add external secret operator integration and workload identity.

## Production note
These manifests are a baseline, not a complete secure platform. Validate with your cluster policy, use immutable image digests, configure PodDisruptionBudget, network policies, workload identity, secret rotation, autoscaling signals and tested rollback procedures.
