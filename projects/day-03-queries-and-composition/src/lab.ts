import { buildSchema, graphql } from "graphql";

const typeDefs = `
  type User { id: ID!, name: String!, role: String! }
  type Post { id: ID!, title: String!, published: Boolean!, author: User! }
  type Query {
    user(id: ID!): User
    users: [User!]!
    post(id: ID!): Post
  }
`;

const users = [
  { id: "u-1", name: "Asha", role: "ADMIN" },
  { id: "u-2", name: "Ravi", role: "MEMBER" }
];
const posts = [
  { id: "post-1", title: "GraphQL fundamentals", published: true, authorId: "u-1" },
  { id: "post-2", title: "Resolver execution", published: false, authorId: "u-2" }
];

export const schema = buildSchema(typeDefs);
export const rootValue = {
  user: ({ id }: { id: string }) => users.find((user) => user.id === id) ?? null,
  users: () => users,
  post: ({ id }: { id: string }) => {
    const post = posts.find((item) => item.id === id);
    return post ? { ...post, author: users.find((user) => user.id === post.authorId) ?? null } : null;
  }
};

export function execute(source: string, variableValues?: Record<string, unknown>, operationName?: string) {
  return graphql({ schema, source, rootValue, variableValues, operationName });
}

if (process.argv[1]?.endsWith("/lab.ts")) {
  const result = await execute(`
    query Dashboard($userId: ID!, $postId: ID!) {
      selectedUser: user(id: $userId) { ...UserSummary }
      selectedPost: post(id: $postId) { id title author { ...UserSummary } }
    }
    fragment UserSummary on User { id name role }
  `, { userId: "u-1", postId: "post-1" });
  console.log(JSON.stringify(result, null, 2));
}
