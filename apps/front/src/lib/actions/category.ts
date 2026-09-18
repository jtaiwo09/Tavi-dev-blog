import { print } from "graphql";
import { authFetchGraphQL } from "../fetchGraphQL";
import { GET_CATEGORIES } from "../gqlQueries";

export async function getCategories() {
  const data = await authFetchGraphQL(print(GET_CATEGORIES));

  return data.categories;
}
