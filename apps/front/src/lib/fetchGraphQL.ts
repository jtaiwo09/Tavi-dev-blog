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

const parseGraphQLResponse = async (response: Response) => {
  const responseText = await response.text();

  let result: any;

  try {
    result = JSON.parse(responseText);
  } catch {
    throw new Error(
      `GraphQL endpoint returned ${response.status} ${response.statusText} instead of JSON`,
    );
  }

  if (!response.ok || result.errors) {
    console.error("GraphQL errors:", JSON.stringify(result.errors, null, 2));

    throw new GraphQLError(
      result.errors?.[0]?.message ?? "GraphQL request failed",
      result.errors ?? [],
    );
  }

  return result.data;
};

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

  return parseGraphQLResponse(response);
};

export const authFetchGraphQL = async <T = any>(
  query: string,
  variables: Record<string, any> = {},
): Promise<T> => {
  const token = await getSession();

  const body = JSON.stringify({
    query,
    variables,
  });

  const payloadBytes = new TextEncoder().encode(body).length;
  console.log("GraphQL request size:", {
    bytes: payloadBytes,
    kb: (payloadBytes / 1024).toFixed(2),
  });

  const response = await fetch(`${BACKEND_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
    },
    body,
  });

  return parseGraphQLResponse(response) as Promise<T>;
};
