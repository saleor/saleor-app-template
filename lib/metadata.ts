import { Client } from "urql";

import { FetchAppDetailsDocument, UpdateAppMetadataDocument } from "../generated/graphql";

export async function fetchPrivateMetadata(client: Client) {
  const response = await client.query(FetchAppDetailsDocument).toPromise();
  const metadata = response.data?.app?.privateMetadata;
  if (!metadata || metadata?.length < 1) {
    return [];
  }
  return metadata.map((m) => ({ key: m.key, value: m.value }));
}

// Send UpdateAppMetadata mutation.
// Function return an error in case of any.
export async function mutatePrivateMetadata(
  client: Client,
  appId: string,
  metadata: { key: string; value: string }[]
) {
  const response = await client
    .mutation(UpdateAppMetadataDocument, {
      id: appId as string,
      input: metadata,
    })
    .toPromise();
  return response.error;
}
