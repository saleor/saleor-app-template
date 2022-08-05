import { SALEOR_DOMAIN_HEADER } from "@saleor/app-sdk/const";
import { Request } from "retes";

import { FetchAppDetailsDocument } from "../generated/graphql";
import { getEnvVars } from "./environment";
import { createClient } from "./graphql";

export async function getAppId(request: Request) {
  // Get installed App ID from the Saleor API based on request
  const { [SALEOR_DOMAIN_HEADER]: saleorDomain } = request.headers;
  const client = createClient(`https://${saleorDomain}/graphql/`, async () =>
    Promise.resolve({ token: (await getEnvVars()).SALEOR_AUTH_TOKEN })
  );

  const appDetails = await client.query(FetchAppDetailsDocument).toPromise();

  return appDetails?.data?.app?.id;
}
