import packageJson from "../../../package.json";
import { AppManifest } from "@saleor/app-sdk/types";

export const config = {
  runtime: "edge",
};

export type CreateManifestHandlerOptions = {
  manifestFactory(context: { appBaseUrl: string }): AppManifest | Promise<AppManifest>;
};

/**
 * Creates API handler for Next.js. Helps with Manifest creation, hides
 * implementation details if possible
 * In the future this will be extracted to separate sdk/next package
 */
export const createManifestHandler = (options: CreateManifestHandlerOptions) => {
  const baseHandler = async (request: Request) => {
    const baseURL = 'localhost:3000'

    const manifest = await options.manifestFactory({
      appBaseUrl: baseURL,
    });

    return new Response(JSON.stringify(manifest), {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
    });
  };

  return baseHandler;
};

export default createManifestHandler({
  async manifestFactory(context: { appBaseUrl: string }): Promise<AppManifest> {

    const manifest: AppManifest = {
      name: packageJson.name,
      tokenTargetUrl: `${context.appBaseUrl}/api/register`,
      appUrl: context.appBaseUrl,
      permissions: [
        /**
         * Set permissions for app if needed
         * https://docs.saleor.io/docs/3.x/developer/permissions
         */
      ],
      id: "saleor.app",
      version: packageJson.version,
      webhooks: [
        /**
         * Configure webhooks here. They will be created in Saleor during installation
         * Read more
         * https://docs.saleor.io/docs/3.x/developer/api-reference/objects/webhook
         *
         * Easiest way to create webhook is to use app-sdk
         * https://github.com/saleor/saleor-app-sdk/blob/main/docs/saleor-async-webhook.md
         */
      ],
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
