import { GraphQLError } from "graphql";

const safeCodes = new Set(["BAD_USER_INPUT", "UNAUTHENTICATED", "FORBIDDEN", "NOT_FOUND", "CONFLICT", "INTERNAL_SERVER_ERROR"]);

export function publicGraphQLError(error: unknown) {
  if (error instanceof GraphQLError) {
    const code = String(error.extensions.code ?? "INTERNAL_SERVER_ERROR");
    const safeMessage = safeCodes.has(code) ? error.message : "An unexpected error occurred";
    return { message: safeMessage, extensions: { code: safeCodes.has(code) ? code : "INTERNAL_SERVER_ERROR" } };
  }
  return { message: "An unexpected error occurred", extensions: { code: "INTERNAL_SERVER_ERROR" } };
}
