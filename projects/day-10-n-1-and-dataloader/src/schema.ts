import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import DataLoader from 'dataloader';
import { GraphQLError } from 'graphql';
import { findUsersByIds, metrics, posts, resetMetrics, users } from './data.js';

const typeDefs = `
  type User { id: ID!, name: String! }
  type Post { id: ID!, title: String!, author: User! }
  type Query {
    posts: [Post!]!
    users: [User!]!
    metrics: QueryMetrics!
  }
  type QueryMetrics { userLookupCalls: Int!, userRowsRead: Int! }
`;

type Context = { userById: DataLoader<string, (typeof users)[number] | null> };

export function createContext(): Context {
  return {
    userById: new DataLoader(async (ids) => {
      const rows = findUsersByIds(ids);
      const byId = new Map(rows.map((user) => [user.id, user]));
      return ids.map((id) => byId.get(id) ?? null);
    }),
  };
}

export const resolvers = {
  Query: {
    posts: () => posts,
    users: () => users,
    metrics: () => metrics,
  },
  Post: {
    // Replace this with users.find(...) to observe N+1 behaviour.
    author: (post: (typeof posts)[number], _args: unknown, context: Context) => {
      if (!post.authorId) throw new GraphQLError('Post author is missing');
      return context.userById.load(post.authorId);
    },
  },
};

export function createServer() {
  return new ApolloServer<Context>({ typeDefs, resolvers });
}

export async function startServer(port = 4000) {
  resetMetrics();
  const server = createServer();
  const { url } = await startStandaloneServer(server, {
    listen: { port },
    context: async () => createContext(),
  });
  return { server, url };
}
