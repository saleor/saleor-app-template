import { createManifestHandler } from "@saleor/app-sdk/handlers/next";
import { AppManifest } from "@saleor/app-sdk/types";

import packageJson from "../../../package.json";
import { productUpdatedWebhook } from "./webhooks/saleor/product-updated";

export default createManifestHandler({
  async manifestFactory(context) {
    const manifest: AppManifest = {
      name: packageJson.name,
      tokenTargetUrl: `${context.appBaseUrl}/api/register`,
      appUrl: context.appBaseUrl,
      permissions: [
        // Add permission required to see non public Product updates
        "MANAGE_PRODUCTS",
        "MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES",
      ],
      id: "saleor.app",
      version: packageJson.version,
      webhooks: [productUpdatedWebhook.getWebhookManifest(context.appBaseUrl)],
      extensions: [
        /**
         * Optionally, extend Dashboard with custom UIs
         * https://docs.saleor.io/docs/3.x/developer/extending/apps/extending-dashboard-with-apps
         */
      ],
    };

    return manifest;
  },
});
