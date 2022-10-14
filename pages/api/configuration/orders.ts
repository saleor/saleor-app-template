import { SALEOR_DOMAIN_HEADER } from "@saleor/app-sdk/const";
import {
  withJWTVerified,
  withRegisteredSaleorDomainHeader,
  withSaleorApp,
} from "@saleor/app-sdk/middleware";
import { MetadataManager } from "@saleor/app-sdk/settings-manager";
import { withSentry } from "@sentry/nextjs";
import type { Handler } from "retes";
import { toNextHandler } from "retes/adapter";
import { Response } from "retes/response";

import { createClient } from "../../../lib/graphql";
import { fetchAllMetadata, mutateMetadata } from "../../../lib/metadata";
import { getAppIdFromApi } from "../../../lib/utils";
import { saleorApp } from "../../../saleor-app";

const handler: Handler = async (request) => {
  const saleorDomain = request.headers[SALEOR_DOMAIN_HEADER] as string;
  const authData = await saleorApp.apl.get(saleorDomain);
  if (!authData) {
    console.debug(`Could not find auth data for the domain ${saleorDomain}.`);
    return Response.Forbidden();
  }

  const client = createClient(`https://${saleorDomain}/graphql/`, async () =>
    Promise.resolve({ token: authData.token })
  );

  const settings = new MetadataManager({
    fetchMetadata: () => fetchAllMetadata(client),
    mutateMetadata: (md) => mutateMetadata(client, md),
  });

  let numberOfOrders: string;
  try {
    numberOfOrders = (await settings.get("NUMBER_OF_ORDERS")) || "10";
  } catch (e: unknown) {
    const error = e as Error;
    console.error(error);
    return Response.InternalServerError({
      success: false,
      message: error.message,
    });
  }

  return Response.OK({ success: true, data: { number_of_orders: numberOfOrders } });
};

export default withSentry(
  toNextHandler([
    withSaleorApp(saleorApp),
    withRegisteredSaleorDomainHeader,
    withJWTVerified(getAppIdFromApi),
    handler,
  ])
);
