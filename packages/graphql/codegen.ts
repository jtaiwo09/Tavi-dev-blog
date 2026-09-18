import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "../../apps/api/src/graphql/schema.gql",

  documents: ["../../apps/web/**/*.graphql", "../../apps/web/**/*.gql"],

  generates: {
    "./src/generated.ts": {
      plugins: ["typescript", "typescript-operations", "typed-document-node"],
    },
  },
};

export default config;
