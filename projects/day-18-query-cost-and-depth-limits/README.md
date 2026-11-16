# Day 18 — Query Depth and Complexity Protection

## Goal
Inspect GraphQL documents before execution and reject operations that exceed server resource budgets.

## Run
```bash
npm install
npm test
npm run typecheck
npm run
```

## Study
- GraphQL validation checks schema correctness, not operational cost.
- Deep nested relationships can amplify database work and response size.
- Depth limits are a simple guardrail; complexity scoring is more expressive.
- List arguments such as `first` and `last` must be bounded.
- Production cost estimators should account for list multipliers, resolver weights and pagination arguments.

## Practice
1. Implement a list multiplier: estimated cost of nested lists should multiply by bounded `first`.
2. Add per-field weights for expensive search/report fields.
3. Add operation timeout and request cancellation.
4. Test aliases and repeated fields in cost analysis.
5. Add persisted-query allowlists for trusted clients.

## Production note
The scoring function here is intentionally illustrative. It does not yet calculate list multipliers or variable-dependent costs. Production systems should combine query depth, weighted complexity, bounded pagination, rate limits, timeouts and monitoring.
