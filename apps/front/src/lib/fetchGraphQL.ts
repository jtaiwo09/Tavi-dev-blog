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
  const contentType = response.headers.get("content-type");
  const responseText = await response.text();

  console.log("========== GRAPHQL RESPONSE ==========");
  console.log("URL:", response.url);
  console.log("STATUS:", response.status);
  console.log("STATUS TEXT:", response.statusText);
  console.log("CONTENT TYPE:", contentType);
  console.log("BODY:", responseText.slice(0, 3000));
  console.log("======================================");

  let result: any;

  try {
    result = JSON.parse(responseText);
  } catch {
    console.error(
      "GraphQL returned a non-JSON response:",
      responseText.slice(0, 3000),
    );

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

  return parseGraphQLResponse(response);
};
