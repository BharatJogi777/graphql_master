import { buildSchema, graphql } from "graphql";

type Post = { id: string; title: string; createdAt: string };
const posts: Post[] = Array.from({ length: 23 }, (_, index) => ({
  id: String(index + 1),
  title: `Post ${index + 1}`,
  createdAt: new Date(Date.UTC(2026, 0, 1, 0, 0, index)).toISOString()
})).reverse();

const schema = buildSchema(`
  type Post { id: ID!, title: String!, createdAt: String! }
  type PageInfo { hasNextPage: Boolean!, hasPreviousPage: Boolean!, startCursor: String, endCursor: String }
  type PostEdge { cursor: String!, node: Post! }
  type PostConnection { edges: [PostEdge!]!, pageInfo: PageInfo!, totalCount: Int! }
  type OffsetPage { items: [Post!]!, page: Int!, pageSize: Int!, totalCount: Int!, totalPages: Int! }
  type Query {
    postsOffset(page: Int = 1, pageSize: Int = 5): OffsetPage!
    posts(first: Int = 5, after: String): PostConnection!
  }
`);
function encodeCursor(id: string) { return Buffer.from(id, "utf8").toString("base64url"); }
function decodeCursor(cursor: string) {
  try {
    const decoded = Buffer.from(cursor, "base64url").toString("utf8");
    if (!decoded || !/^[1-9][0-9]*$/.test(decoded)) throw new Error();
    return decoded;
  } catch { throw new Error("Invalid pagination cursor"); }
}
const rootValue = {
  postsOffset: ({ page = 1, pageSize = 5 }: { page?: number; pageSize?: number }) => {
    if (!Number.isInteger(page) || page < 1) throw new Error("page must be a positive integer");
    if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > 20) throw new Error("pageSize must be between 1 and 20");
    const totalCount = posts.length;
    return { items: posts.slice((page - 1) * pageSize, page * pageSize), page, pageSize, totalCount, totalPages: Math.ceil(totalCount / pageSize) };
  },
  posts: ({ first = 5, after }: { first?: number; after?: string | null }) => {
    if (!Number.isInteger(first) || first < 1 || first > 20) throw new Error("first must be between 1 and 20");
    const startIndex = after ? posts.findIndex((post) => post.id === decodeCursor(after)) + 1 : 0;
    if (after && startIndex === 0) throw new Error("Cursor does not refer to an existing post");
    const slice = posts.slice(startIndex, startIndex + first + 1);
    const hasNextPage = slice.length > first;
    const pagePosts = slice.slice(0, first);
    const edges = pagePosts.map((node) => ({ node, cursor: encodeCursor(node.id) }));
    return {
      edges,
      totalCount: posts.length,
      pageInfo: {
        hasNextPage,
        hasPreviousPage: startIndex > 0,
        startCursor: edges[0]?.cursor ?? null,
        endCursor: edges.at(-1)?.cursor ?? null
      }
    };
  }
};
export function execute(source: string, variableValues?: Record<string, unknown>) {
  return graphql({ schema, source, rootValue, variableValues });
}
export { encodeCursor, decodeCursor };
if (process.argv[1]?.endsWith("/lab.ts")) {
  console.log(JSON.stringify(await execute("{ posts(first: 3) { edges { cursor node { id title } } pageInfo { hasNextPage endCursor } totalCount } }"), null, 2));
}
