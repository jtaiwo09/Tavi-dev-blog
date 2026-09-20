"use server";

import { print } from "graphql";
import { authFetchGraphQL } from "@/lib/fetchGraphQL";
import { GET_TAGS } from "@/lib/gqlQueries";

export async function getTags() {
  const data = await authFetchGraphQL(print(GET_TAGS));

  return data.tags;
}
