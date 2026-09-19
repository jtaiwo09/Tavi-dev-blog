"use server";

import { print } from "graphql";
import { authFetchGraphQL } from "@/lib/fetchGraphQL";
import { GET_CATEGORIES } from "@/lib/gqlQueries";

export async function getCategories() {
  const data = await authFetchGraphQL(print(GET_CATEGORIES));

  return data.categories;
}
