import {
  GraphQLBoolean, GraphQLID, GraphQLInterfaceType, GraphQLList, GraphQLNonNull,
  GraphQLObjectType, GraphQLScalarType, GraphQLSchema, GraphQLString, GraphQLUnionType,
  Kind, graphql
} from "graphql";

const users = [{ id: "u-1", name: "Asha", createdAt: new Date("2026-01-01T00:00:00.000Z") }];
const posts = [{ id: "p-1", title: "GraphQL types", published: true, createdAt: new Date("2026-02-01T00:00:00.000Z") }];

export const DateTimeScalar = new GraphQLScalarType({
  name: "DateTime",
  description: "ISO-8601 timestamp",
  serialize(value) {
    const date = value instanceof Date ? value : new Date(String(value));
    if (Number.isNaN(date.getTime())) throw new TypeError("DateTime cannot represent an invalid date");
    return date.toISOString();
  },
  parseValue(value) {
    if (typeof value !== "string" || Number.isNaN(Date.parse(value))) throw new TypeError("DateTime must be an ISO date string");
    return new Date(value);
  },
  parseLiteral(ast) {
    if (ast.kind !== Kind.STRING || Number.isNaN(Date.parse(ast.value))) throw new TypeError("DateTime literal must be an ISO date string");
    return new Date(ast.value);
  }
});

const NodeType = new GraphQLInterfaceType({
  name: "Node",
  fields: { id: { type: new GraphQLNonNull(GraphQLID) } },
  resolveType(value) {
    return "name" in value ? "User" : "Post";
  }
});

const UserType = new GraphQLObjectType({
  name: "User",
  interfaces: [NodeType],
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    createdAt: { type: new GraphQLNonNull(DateTimeScalar) }
  }
});
const PostType = new GraphQLObjectType({
  name: "Post",
  interfaces: [NodeType],
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    published: { type: new GraphQLNonNull(GraphQLBoolean) },
    createdAt: { type: new GraphQLNonNull(DateTimeScalar) }
  }
});
const SearchResultType = new GraphQLUnionType({
  name: "SearchResult",
  types: [UserType, PostType],
  resolveType(value) { return "name" in value ? "User" : "Post"; }
});
const QueryType = new GraphQLObjectType({
  name: "Query",
  fields: {
    search: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(SearchResultType))),
      resolve: () => [...users, ...posts]
    },
    node: {
      type: NodeType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: (_source, args: { id: string }) => [...users, ...posts].find((item) => item.id === args.id) ?? null
    }
  }
});
export const schema = new GraphQLSchema({ query: QueryType, types: [UserType, PostType] });
export function execute(source: string) { return graphql({ schema, source }); }
if (process.argv[1]?.endsWith("/lab.ts")) {
  console.log(JSON.stringify(await execute(`{ search { __typename ... on User { name createdAt } ... on Post { title published createdAt } } }`), null, 2));
}
