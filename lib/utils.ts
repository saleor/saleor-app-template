import { SALEOR_DOMAIN_HEADER } from "@saleor/app-sdk/const";
import { Request } from "retes";

import { FetchAppDetailsDocument } from "../generated/graphql";
import { saleorApp } from "../saleor-app";
import { createClient } from "./graphql";

export async function getAppIdFromApi(request: Request): Promise<string | undefined> {
  // Get installed App ID from the Saleor API based on request
  const { [SALEOR_DOMAIN_HEADER]: saleorDomain } = request.headers;
  if (!saleorDomain) {
    return undefined;
  }
  const authData = await saleorApp.apl.get(saleorDomain as string);
  if (!authData) {
    return undefined;
  }
  const client = createClient(`https://${saleorDomain}/graphql/`, async () =>
    Promise.resolve({ token: authData?.token })
  );

  const appDetails = await client.query(FetchAppDetailsDocument, {}).toPromise();

  return appDetails?.data?.app?.id;
}
