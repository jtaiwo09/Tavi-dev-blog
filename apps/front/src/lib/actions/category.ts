"use server";

import { print } from "graphql";
import { fetchGraphQL } from "@/lib/fetchGraphQL";
import { GET_CATEGORIES } from "@/lib/gqlQueries";

export async function getCategories() {
  const data = await fetchGraphQL(print(GET_CATEGORIES));

  return data.categories;
}
