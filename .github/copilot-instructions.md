# Copilot Instructions

## Verify Schema

Whenever the user is asking for integration with Saleor API, verify the [schema.graphql](../graphql/schema.graphql) to match the queries, mutations and inputs required by Saleor API.

## GraphQL Files

Whenever the user requires some GraphQL query/mutation, write them to a .graphql file in [/graphql](../graphql) folder. Queries go to "/query", mutations go to "/mutations" etc.

## Generating Types

When you add a new GraphQL file, make sure to regenerate the types using the "generate" command from [package.json](../package.json). It may take some time for the TS Server to detect the changes.
