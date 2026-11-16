import {
  GraphQLBoolean, GraphQLID, GraphQLList, GraphQLNonNull, GraphQLObjectType,
  GraphQLSchema, GraphQLString
} from "graphql";

interface User { id: string; name: string }
interface Post { id: string; title: string; authorId: string; published: boolean }
const users: User[] = [{ id: "u-1", name: "Asha" }, { id: "u-2", name: "Ravi" }];
const posts: Post[] = [
  { id: "post-1", title: "GraphQL basics", authorId: "u-1", published: true },
  { id: "post-2", title: "Resolver tree", authorId: "u-1", published: false },
  { id: "post-3", title: "API design", authorId: "u-2", published: true }
];

export const resolverTrace: string[] = [];
export function resetTrace() { resolverTrace.length = 0; }

let UserType: GraphQLObjectType;
let PostType: GraphQLObjectType;

UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
      resolve: (user: User) => {
        resolverTrace.push(`User.posts:${user.id}`);
        return posts.filter((post) => post.authorId === user.id);
      }
    }
  })
});

PostType = new GraphQLObjectType({
  name: "Post",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    published: { type: new GraphQLNonNull(GraphQLBoolean) },
    author: {
      type: new GraphQLNonNull(UserType),
      resolve: (post: Post) => {
        resolverTrace.push(`Post.author:${post.id}`);
        const author = users.find((user) => user.id === post.authorId);
        if (!author) throw new Error("Post author not found");
        return author;
      }
    }
  })
});

const QueryType = new GraphQLObjectType({
  name: "Query",
  fields: {
    users: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: () => { resolverTrace.push("Query.users"); return users; }
    },
    user: {
      type: UserType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: (_source, args: { id: string }) => {
        resolverTrace.push(`Query.user:${args.id}`);
        return users.find((user) => user.id === args.id) ?? null;
      }
    }
  }
});

export const schema = new GraphQLSchema({ query: QueryType });
export async function execute(source: string) {
  return (await import("graphql")).graphql({ schema, source });
}
if (process.argv[1]?.endsWith("/lab.ts")) {
  console.log(JSON.stringify(await execute(`{ users { name posts { title author { name } } } }`), null, 2));
  console.log("Resolver trace:", resolverTrace);
}
