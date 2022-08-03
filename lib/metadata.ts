import { FetchAppDetailsDocument, FetchAppDetailsQuery } from "../generated/graphql";
import { saleorApiClient } from "./configuration";

export const getValue = async (saleorDomain: string, key: string) => {
  const client = saleorApiClient(saleorDomain);

  const item = (
    await client.query<FetchAppDetailsQuery>(FetchAppDetailsDocument).toPromise()
  ).data?.app?.privateMetadata!.find((i) => i.key === key);

  if (item === undefined) {
    throw Error("Metadata not found.");
  }
  return item.value;
};
