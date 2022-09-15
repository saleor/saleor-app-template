import { SALEOR_DOMAIN_HEADER } from "@saleor/app-sdk/const";
import { Request } from "retes";

import { FetchAppDetailsDocument } from "../../generated/graphql";
import { createGraphQlClient } from "./create-graphql-client";
import { apl } from "./apl";

export async function getAppIdFromApi(request: Request): Promise<string | undefined> {
  // Get installed App ID from the Saleor API based on request
  const { [SALEOR_DOMAIN_HEADER]: saleorDomain } = request.headers;
  if (!saleorDomain) {
    return undefined;
  }
  const authData = await apl.get(saleorDomain as string);
  if (!authData) {
    return undefined;
  }
  const client = createGraphQlClient(`https://${saleorDomain}/graphql/`, async () =>
    Promise.resolve({ token: authData?.token })
  );

  const appDetails = await client.query(FetchAppDetailsDocument, {}).toPromise();

  return appDetails?.data?.app?.id;
}
