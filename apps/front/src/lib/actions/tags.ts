"use server";

import { print } from "graphql";
import { fetchGraphQL } from "@/lib/fetchGraphQL";
import { GET_TAGS } from "@/lib/gqlQueries";

export async function getTags() {
  const data = await fetchGraphQL(print(GET_TAGS));

  return data.tags;
}
