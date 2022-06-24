import { createClient } from "./graphql";
import { getAuthToken } from "./environment";
import { FetchAppDetailsDocument } from "../generated/graphql";

export const getValue = async (saleorDomain: string, key: string) => {
  const client = createClient(`https://${saleorDomain}/graphql/`, async () =>
    Promise.resolve({ token: getAuthToken() })
  );

  const item = (
    await client.query(FetchAppDetailsDocument).toPromise()
  ).data?.app?.privateMetadata!.find((i) => i.key === key);

  if (item === undefined) {
    throw Error("Metadata not found.");
  }
  return item.value;
};
