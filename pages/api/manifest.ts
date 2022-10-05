import { AppManifest, inferWebhooks } from "@saleor/app-sdk";
import { createManifestHandler } from "@saleor/app-sdk/handlers/next";
import { withSentry } from "@sentry/nextjs";

import * as GeneratedGraphQL from "../../generated/graphql";
import packageJson from "../../package.json";

const handler = createManifestHandler({
  async manifestFactory(context) {
    const webhooks = await inferWebhooks(
      context.appBaseUrl,
      `${__dirname}/webhooks`,
      GeneratedGraphQL
    );

    const manifest: AppManifest = {
      name: packageJson.name,
      tokenTargetUrl: `${context.appBaseUrl}/api/register`,
      appUrl: context.appBaseUrl,
      permissions: ["MANAGE_ORDERS"],
      id: "saleor.app",
      version: packageJson.version,
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

    return manifest;
  },
});

export default withSentry(handler);
