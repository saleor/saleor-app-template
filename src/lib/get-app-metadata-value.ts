import { FetchAppDetailsDocument, FetchAppDetailsQuery } from "../../generated/graphql";
import { createGraphQlClient } from "./create-graphql-client";
import { apl } from "./saleorApp";

/**
 * TODO - Create MetadataManager in app-sdk
 */
export const getAppMetadataValue = async (saleorDomain: string, key: string) => {
  const authData = await apl.get(saleorDomain);

  if (!authData) {
    throw Error(`Couldn't find auth data for domain ${saleorDomain}`);
  }

  const client = createGraphQlClient(`https://${saleorDomain}/graphql/`, async () =>
    Promise.resolve({ token: authData.token })
  );

  const item = (
    await client.query<FetchAppDetailsQuery>(FetchAppDetailsDocument, {}).toPromise()
  ).data?.app?.privateMetadata!.find((i) => i.key === key);

  if (item === undefined) {
    throw Error("Metadata not found.");
  }
  return item.value;
};
