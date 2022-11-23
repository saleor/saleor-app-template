import { MetadataEntry } from "@saleor/app-sdk/settings-manager";
import { Client } from "urql";

import {
  FetchAppDetailsDocument,
  FetchAppDetailsQuery,
  UpdateAppMetadataDocument,
} from "../../generated/graphql";

export async function fetchAllMetadata(client: Client): Promise<MetadataEntry[]> {
  const { error, data } = await client
    .query<FetchAppDetailsQuery>(FetchAppDetailsDocument, {})
    .toPromise();

  if (error) {
    console.debug("Error during fetching the metadata: ", error);
    return [];
  }

  return data?.app?.privateMetadata.map((md) => ({ key: md.key, value: md.value })) || [];
}

export async function mutateMetadata(client: Client, metadata: MetadataEntry[]) {
  // to update the metadata, ID is required
  const { error: idQueryError, data: idQueryData } = await client
    .query(FetchAppDetailsDocument, {})
    .toPromise();

  if (idQueryError) {
    console.debug("Could not fetch the app id: ", idQueryError);
    throw new Error(
      "Could not fetch the app id. Please check if auth data for the client are valid."
    );
  }

  const appId = idQueryData?.app?.id;

  if (!appId) {
    console.debug("Missing app id");
    throw new Error("Could not fetch the app ID");
  }

  const { error: mutationError, data: mutationData } = await client
    .mutation(UpdateAppMetadataDocument, {
      id: appId,
      input: metadata,
    })
    .toPromise();

  if (mutationError) {
    console.debug("Mutation error: ", mutationError);
    throw new Error(`Mutation error: ${mutationError.message}`);
  }

  return (
    mutationData?.updatePrivateMetadata?.item?.privateMetadata.map((md) => ({
      key: md.key,
      value: md.value,
    })) || []
  );
}
