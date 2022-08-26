import { inferWebhooks } from "@saleor/app-sdk";
import { withBaseURL } from "@saleor/app-sdk/middleware";
import { withSentry } from "@sentry/nextjs";
import type { Handler } from "retes";
import { toNextHandler } from "retes/adapter";
import { Response } from "retes/response";

import * as GeneratedGraphQL from "../../generated/graphql";
import packageJson from "../../package.json";

const handler: Handler = async (request) => {
  const { baseURL } = request.context;

  const webhooks = await inferWebhooks(baseURL, `${__dirname}/webhooks`, GeneratedGraphQL);

  const manifest = {
    id: "saleor.app",
    version: packageJson.version,
    name: packageJson.name,
    permissions: ["MANAGE_ORDERS"],
    appUrl: baseURL,
    tokenTargetUrl: `${baseURL}/api/register`,
    webhooks,
    extensions: [
      {
        label: "Guest orders",
        mount: "NAVIGATION_ORDERS",
        target: "APP_PAGE",
        permissions: ["MANAGE_ORDERS"],
        url: "/orders",
      },
    ],
  };

  return Response.OK(manifest);
};

export default withSentry(toNextHandler([withBaseURL, handler]));
