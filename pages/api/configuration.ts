import { SALEOR_DOMAIN_HEADER } from "@saleor/app-sdk/const";
import {
  withJWTVerified,
  withRegisteredSaleorDomainHeader,
  withSaleorApp,
} from "@saleor/app-sdk/middleware";
import { MetadataManager, SettingsManager } from "@saleor/app-sdk/settings-manager";
import { withSentry } from "@sentry/nextjs";
import { IncomingMessage } from "http";
import type { Handler } from "retes";
import { toNextHandler } from "retes/adapter";
import { Response } from "retes/response";

import { createClient } from "../../lib/graphql";
import { fetchAllMetadata, mutateMetadata } from "../../lib/metadata";
import { getAppIdFromApi } from "../../lib/utils";
import { saleorApp } from "../../saleor-app";

type ConfigurationField = {
  label: string;
  key: string;
};

type RequestData = {
  data: { key: string; value: string }[];
};

type ResponseData = {
  data: { key: string; value: string; label: string }[];
};

const CONFIGURATION_FIELDS: ConfigurationField[] = [
  { label: "Number of orders", key: "NUMBER_OF_ORDERS" },
];

const prepareResponseData = async (settings: SettingsManager): Promise<ResponseData> => {
  const data = [];
  for (const field of CONFIGURATION_FIELDS) {
    data.push({
      ...field,
      value: (await settings.get(field.key)) || "",
    });
  }
  return {
    data,
  };
};

const saveRequestData = async (body: IncomingMessage, settings: SettingsManager) => {
  const submittedData = body as unknown as RequestData;
  const valuesToUpdate = submittedData.data.filter((field) =>
    CONFIGURATION_FIELDS.find(({ key }) => key === field.key)
  );
  await settings.set(valuesToUpdate);
};

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

  switch (request.method!) {
    case "GET":
      return Response.OK(await prepareResponseData(settings));
    case "POST": {
      try {
        await saveRequestData(request.body, settings);
      } catch (e) {
        return Response.InternalServerError({
          error: e,
        });
      }
      return Response.OK(await prepareResponseData(settings));
    }
    default:
      return Response.MethodNotAllowed();
  }
};

export default withSentry(
  toNextHandler([
    withSaleorApp(saleorApp),
    withRegisteredSaleorDomainHeader,
    withJWTVerified(getAppIdFromApi),
    handler,
  ])
);
