import { AppManifest, AppExtension, AppExtensionMount } from "@saleor/app-sdk";
import { createManifestHandler } from "@saleor/app-sdk/handlers/next";

import packageJson from "../../../package.json";
import { AppExtensionMountEnum } from "../../../generated/graphql";

// List of available extension mounting points is available in AppExtensionMountEnum.
// In this example we want to use them all to showcase available options.
// Instead of writing extension manifest one by one, let's create function which will create all of them:
export const generateAppExtensions = (baseUrl: string): AppExtension[] =>
  Object.values(AppExtensionMountEnum).map((mount) => ({
    // Label which will be displayed in the dashboard menus
    label: `${mount} extension`,
    mount: mount as AppExtensionMount,
    // List of user permission required to show extension in the dashboard
    permissions: [],
    // How iframe of your extension will be displayed: modal (POPUP) or separate page (APP_PAGE)
    target: "POPUP",
    // Route of the page which will be displayed inside of the iframe
    url: `${baseUrl}/extensions/${mount}/POPUP/extension`,
  }));

export default createManifestHandler({
  async manifestFactory(context) {
    const manifest: AppManifest = {
      name: packageJson.name,
      tokenTargetUrl: `${context.appBaseUrl}/api/register`,
      appUrl: context.appBaseUrl,
      // Remember to add permissions to your app, depending on which objects it will query/mutate.
      // For example, if you created an extension mounted at PRODUCT_DETAILS_MORE_ACTIONS, most likely
      // you'll also need MANAGE_PRODUCTS permission.
      // Since this app does not require access to such data, we can skip it.
      permissions: [],
      id: "saleor.app",
      version: packageJson.version,
      webhooks: [],
      // Add extensions to the manifest
      extensions: generateAppExtensions(context.appBaseUrl),
    };

    return manifest;
  },
});
