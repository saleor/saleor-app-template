import { SALEOR_DOMAIN_HEADER } from "@saleor/app-sdk/const";
import {
  withJWTVerified,
  withRegisteredSaleorDomainHeader,
  withSaleorApp,
} from "@saleor/app-sdk/middleware";
import { withSentry } from "@sentry/nextjs";
import { IncomingMessage } from "http";
import type { Handler } from "retes";
import { toNextHandler } from "retes/adapter";
import { Response } from "retes/response";

import { createClient } from "../../lib/graphql";
import { MetadataManager } from "../../lib/metadataManager";
import { SettingsManager } from "../../lib/saleorApp";
import { getAppIdFromApi } from "../../lib/utils";
import { saleorApp } from "../../saleor-app";

const prepareResponseData = async (settings: MetadataManager, domain: string) => ({
  data: [
    { label: "Example input 1", key: "input_1", value: await settings.get("input_1") },
    { label: "Example input 2", key: "input_2", value: await settings.get("input_2") },
    {
      label: "Example input 3, domain specific",
      key: "input_3",
      value: await settings.get("input_3", domain),
    },
    // it's only to test if domain specific getter is working right
    {
      label: "Example input 3, but with wrong domain",
      key: "input_3",
      value: await settings.get("input_3", "example.com"),
    },
  ],
});

const saveRequestData = async (
  body: IncomingMessage,
  domain: string,
  settings: MetadataManager
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const submittedData = body as unknown as { data: { key: string; value: string }[] };
  // submittedData.data as ;
  const input1 = submittedData.data.find((entry) => entry.key === "input_1")?.value || "";
  const input2 = submittedData.data.find((entry) => entry.key === "input_2")?.value || "";
  const input3 = submittedData.data.find((entry) => entry.key === "input_3")?.value || "";
  await settings.set([
    { key: "input_1", value: input1 },
    { key: "input_2", value: input2 },
    { key: "input_3", value: input3, domain },
  ]);
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

  const settings = new SettingsManager(client);

  switch (request.method!) {
    case "GET":
      return Response.OK(await prepareResponseData(settings, saleorDomain));
    case "POST": {
      try {
        await saveRequestData(request.body, saleorDomain, settings);
      } catch (e) {
        return Response.InternalServerError({
          error: e,
        });
      }
      return Response.OK(await prepareResponseData(settings, saleorDomain));
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
