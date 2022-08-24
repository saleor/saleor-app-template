import { SALEOR_DOMAIN_HEADER } from "@saleor/app-sdk/const";
import { Request } from "retes";
import { Client } from "urql";

import { FetchAppDetailsDocument } from "../generated/graphql";
import { SaleorAppConfig } from "./saleorApp";
import { saleorApiClient } from "./serverSideClient";

export async function fetchAppId(client: Client) {
  const response = await client.query(FetchAppDetailsDocument).toPromise();
  return response?.data?.app?.id;
}

// todo: Remove this function after withJWTVerified refactor
export async function getAppIdFromApi(request: Request) {
  // Get installed App ID from the Saleor API based on request
  const { [SALEOR_DOMAIN_HEADER]: saleorDomain } = request.headers;
  const auth = await SaleorAppConfig.auth.get(saleorDomain);
  const client = saleorApiClient(saleorDomain, auth?.token!);

  return fetchAppId(client);
}
