import { BACKEND_URL } from "./constants";
import { getSession } from "./session";

export class GraphQLError extends Error {
  constructor(
    message: string,
    public readonly errors: unknown[],
  ) {
    super(message);
    this.name = "GraphQLError";
  }
}

export const fetchGraphQL = async (query: string, variables = {}) => {
  const response = await fetch(`${BACKEND_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const result = await response.json();

  if (!response.ok || result.errors) {
    console.error("GraphQL errors:", JSON.stringify(result.errors, null, 2));

    throw new GraphQLError(
      result.errors?.[0]?.message ?? "GraphQL request failed",
      result.errors ?? [],
    );
  }

  return result.data;
};

export const authFetchGraphQL = async (query: string, variables = {}) => {
  const session = await getSession();

  const response = await fetch(`${BACKEND_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(session?.accessToken
        ? {
            Authorization: `Bearer ${session.accessToken}`,
          }
        : {}),
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const result = await response.json();

  if (!response.ok || result.errors) {
    console.error("GraphQL errors:", JSON.stringify(result.errors, null, 2));

    throw new GraphQLError(
      result.errors?.[0]?.message ?? "GraphQL request failed",
      result.errors ?? [],
    );
  }

  return result.data;
};
