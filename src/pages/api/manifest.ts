import { createManifestHandler } from "@saleor/app-sdk/handlers/next";
import { AppManifest } from "@saleor/app-sdk/types";

import packageJson from "../../../package.json";
import { orderCreatedWebhook } from "./webhooks/order-created";

/**
 * App SDK helps with the valid Saleor App Manifest creation. Read more:
 * https://github.com/saleor/saleor-app-sdk/blob/main/docs/api-handlers.md#manifest-handler-factory
 */
export default createManifestHandler({
  async manifestFactory({ appBaseUrl, request, schemaVersion }) {
    /**
     * Allow to overwrite default app base url, to enable Docker support.
     *
     * See docs: https://docs.saleor.io/docs/3.x/developer/extending/apps/local-app-development
     */
    const iframeBaseUrl = process.env.APP_IFRAME_BASE_URL ?? appBaseUrl;
    const apiBaseURL = process.env.APP_API_BASE_URL ?? appBaseUrl;

    const manifest: AppManifest = {
      name: "Saleor App Template",
      tokenTargetUrl: `${apiBaseURL}/api/register`,
      appUrl: iframeBaseUrl,
      /**
       * Set permissions for app if needed
       * https://docs.saleor.io/docs/3.x/developer/permissions
       */
      permissions: [
        /**
         * Add permission to allow "ORDER_CREATED" webhook registration.
         *
         * This can be removed
         */
        "MANAGE_ORDERS",
      ],
      id: "saleor.app",
      version: packageJson.version,
      /**
       * Configure webhooks here. They will be created in Saleor during installation
       * Read more
       * https://docs.saleor.io/docs/3.x/developer/api-reference/webhooks/objects/webhook
       *
       * Easiest way to create webhook is to use app-sdk
       * https://github.com/saleor/saleor-app-sdk/blob/main/docs/saleor-webhook.md
       */
      webhooks: [orderCreatedWebhook.getWebhookManifest(apiBaseURL)],
      /**
       * Optionally, extend Dashboard with custom UIs
       * https://docs.saleor.io/docs/3.x/developer/extending/apps/extending-dashboard-with-apps
       */
      extensions: [
        {
          label: "Open CATEGORY create button",
          mount: "CATEGORY_OVERVIEW_CREATE",
          target: "POPUP",
          permissions: [],
          url: "/extension",
        },
        {
          label: "Open CATEGORY list action",
          mount: "CATEGORY_OVERVIEW_MORE_ACTIONS",
          target: "POPUP",
          permissions: [],
          url: "/extension",
        },
        {
          label: "Open CATEGORY details action",
          mount: "CATEGORY_DETAILS_MORE_ACTIONS",
          target: "POPUP",
          permissions: [],
          url: "/extension",
        },
        {
          label: "Open COLLECTION create button",
          mount: "COLLECTION_OVERVIEW_CREATE",
          target: "POPUP",
          permissions: [],
          url: "/extension",
        },
        {
          label: "Open COLLECTION list action",
          mount: "COLLECTION_OVERVIEW_MORE_ACTIONS",
          target: "POPUP",
          permissions: [],
          url: "/extension",
        },
        {
          label: "Open COLLECTION details action",
          mount: "COLLECTION_DETAILS_MORE_ACTIONS",
          target: "POPUP",
          permissions: [],
          url: "/extension",
        },
        {
          label: "Open GIFT_CARD create button",
          mount: "GIFT_CARD_OVERVIEW_CREATE",
          target: "POPUP",
          permissions: [],
          url: "/extension",
        },
        {
          label: "Open GIFT_CARD list action",
          mount: "GIFT_CARD_OVERVIEW_MORE_ACTIONS",
          target: "POPUP",
          permissions: [],
          url: "/extension",
        },
        {
          label: "Open GIFT_CARD details action",
          mount: "GIFT_CARD_DETAILS_MORE_ACTIONS",
          target: "POPUP",
          permissions: [],
          url: "/extension",
        },
        {
          label: "Open DRAFT_ORDER create button",
          mount: "DRAFT_ORDER_OVERVIEW_CREATE",
          target: "POPUP",
          permissions: [],
          url: "/extension",
        },
        {
          label: "Open DRAFT_ORDER list action",
          mount: "DRAFT_ORDER_OVERVIEW_MORE_ACTIONS",
          target: "POPUP",
          permissions: [],
          url: "/extension",
        },
        {
          label: "Open DRAFT_ORDER details action",
          mount: "DRAFT_ORDER_DETAILS_MORE_ACTIONS",
          target: "POPUP",
          permissions: [],
          url: "/extension",
        },
        {
          label: "Open DISCOUNT create button",
          mount: "DISCOUNT_OVERVIEW_CREATE",
          target: "POPUP",
          permissions: [],
          url: "/extension",
        },
        {
          label: "Open DISCOUNT list action",
          mount: "DISCOUNT_OVERVIEW_MORE_ACTIONS",
          target: "POPUP",
          permissions: [],
          url: "/extension",
        },
        {
          label: "Open DISCOUNT details action",
          mount: "DISCOUNT_DETAILS_MORE_ACTIONS",
          target: "POPUP",
          permissions: [],
          url: "/extension",
        },
        {
          label: "Open VOUCHER create button",
          mount: "VOUCHER_OVERVIEW_CREATE",
          target: "POPUP",
          permissions: [],
          url: "/extension",
        },
        {
          label: "Open VOUCHER list action",
          mount: "VOUCHER_OVERVIEW_MORE_ACTIONS",
          target: "POPUP",
          permissions: [],
          url: "/extension",
        },
        {
          label: "Open VOUCHER details action",
          mount: "VOUCHER_DETAILS_MORE_ACTIONS",
          target: "POPUP",
          permissions: [],
          url: "/extension",
        },
        {
          label: "Open PAGE create button",
          mount: "PAGE_OVERVIEW_CREATE",
          target: "POPUP",
          permissions: [],
          url: "/extension",
        },
        {
          label: "Open PAGE list action",
          mount: "PAGE_OVERVIEW_MORE_ACTIONS",
          target: "POPUP",
          permissions: [],
          url: "/extension",
        },
        {
          label: "Open PAGE details action",
          mount: "PAGE_DETAILS_MORE_ACTIONS",
          target: "POPUP",
          permissions: [],
          url: "/extension",
        },
        {
          label: "Open PAGE_TYPE create button",
          mount: "PAGE_TYPE_OVERVIEW_CREATE",
          target: "POPUP",
          permissions: [],
          url: "/extension",
        },
        {
          label: "Open PAGE_TYPE list action",
          mount: "PAGE_TYPE_OVERVIEW_MORE_ACTIONS",
          target: "POPUP",
          permissions: [],
          url: "/extension",
        },
        {
          label: "Open PAGE_TYPE details action",
          mount: "PAGE_TYPE_DETAILS_MORE_ACTIONS",
          target: "POPUP",
          permissions: [],
          url: "/extension",
        },
        {
          label: "Open MENU create button",
          mount: "MENU_OVERVIEW_CREATE",
          target: "POPUP",
          permissions: [],
          url: "/extension",
        },
        {
          label: "Open MENU list action",
          mount: "MENU_OVERVIEW_MORE_ACTIONS",
          target: "POPUP",
          permissions: [],
          url: "/extension",
        },
        {
          label: "Open MENU details action",
          mount: "MENU_DETAILS_MORE_ACTIONS",
          target: "POPUP",
          permissions: [],
          url: "/extension",
        },
      ],
      author: "Saleor Commerce",
      brand: {
        logo: {
          default: `${apiBaseURL}/logo.png`,
        },
      },
    };

    return manifest;
  },
});
