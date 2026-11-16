import { InMemoryCache } from "@apollo/client/core";

export function createCache() {
  return new InMemoryCache({
    typePolicies: {
      Product: { keyFields: ["id"] },
      Query: {
        fields: {
          products: {
            keyArgs: ["status"],
            merge(existing: unknown[] = [], incoming: unknown[], { args }) {
              const offset = Number(args?.offset ?? 0);
              const merged = existing.slice(0);
              for (let i = 0; i < incoming.length; i++) merged[offset + i] = incoming[i];
              return merged;
            }
          }
        }
      }
    }
  });
}
