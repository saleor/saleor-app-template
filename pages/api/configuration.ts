import { SALEOR_DOMAIN_HEADER } from "@saleor/app-sdk/const";
import { withJWTVerified } from "@saleor/app-sdk/middleware";
import { withSentry } from "@sentry/nextjs";
import type { Handler } from "retes";
import { toNextHandler } from "retes/adapter";
import { Response } from "retes/response";

import { MetadataInput, MetadataItem } from "../../generated/graphql";
import { fetchPrivateMetadata, mutatePrivateMetadata } from "../../lib/metadata";
import { SaleorAppConfig } from "../../lib/saleorApp";
import { saleorApiClient } from "../../lib/serverSideClient";
import { fetchAppId, getAppIdFromApi } from "../../lib/utils";

const CONFIGURATION_KEYS = ["NUMBER_OF_ORDERS"];

// Returns set of specified metadata.
// If the key is not yet existing in the private metadata, will return object with an empty value.
const prepareMetadata = (input: MetadataInput[] | MetadataItem[]) =>
  CONFIGURATION_KEYS.map(
    (configurationKey) =>
      input.find(({ key }) => key === configurationKey) ?? {
        key: configurationKey,
        value: "",
      }
  );

// REST endpoint for getting and setting specified metadata
const handler: Handler = async (request) => {
  console.debug("Configuration API handler.");

  // todo: the handler should use
  // await SaleorAppConfig.restrictedPaths.process(req, res);

  const saleorDomain = request.headers[SALEOR_DOMAIN_HEADER];

  const auth = await SaleorAppConfig.auth.get(saleorDomain);
  if (!auth) {
    return Response.Forbidden({
      success: false,
    });
  }
  const client = saleorApiClient(saleorDomain, auth.token);

  switch (request.method!) {
    case "GET": {
      const privateMetadata = await fetchPrivateMetadata(client);

      return Response.OK({
        success: true,
        data: prepareMetadata(privateMetadata),
      });
    }
    case "POST": {
      const newMetadata = prepareMetadata((request.body as any).data);

      const appId = await fetchAppId(client);

      if (!appId) {
        return Response.InternalServerError({
          success: false,
          message: "Could not fetch App ID.",
        });
      }

      const mutationErrors = await mutatePrivateMetadata(client, appId, newMetadata);
      if (mutationErrors) {
        return Response.InternalServerError({ success: false, message: mutationErrors.message });
      }
      return Response.OK({
        success: true,
        data: newMetadata,
      });
    }
    default:
      return Response.MethodNotAllowed();
  }
};

export default withSentry(
  // toNextHandler([withSaleorDomainMatch, withJWTVerified(getAppIdFromApi), handler])
  toNextHandler([withJWTVerified(getAppIdFromApi), handler])
);
