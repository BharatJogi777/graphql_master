export interface User { id: string; name: string }
export interface Post { id: string; authorId: string; title: string }

export const users: User[] = [
  { id: 'u1', name: 'Asha' },
  { id: 'u2', name: 'Ravi' },
  { id: 'u3', name: 'Meera' },
];

export const posts: Post[] = [
  { id: 'p1', authorId: 'u1', title: 'GraphQL basics' },
  { id: 'p2', authorId: 'u2', title: 'Resolver execution' },
  { id: 'p3', authorId: 'u1', title: 'Avoiding N+1' },
  { id: 'p4', authorId: 'u3', title: 'DataLoader batching' },
  { id: 'p5', authorId: 'u2', title: 'Schema design' },
];

export const metrics = { userLookupCalls: 0, userRowsRead: 0 };

export function resetMetrics() {
  metrics.userLookupCalls = 0;
  metrics.userRowsRead = 0;
}

export function findUsersByIds(ids: readonly string[]) {
  metrics.userLookupCalls += 1;
  const found = users.filter((user) => ids.includes(user.id));
  metrics.userRowsRead += found.length;
  return found;
}
