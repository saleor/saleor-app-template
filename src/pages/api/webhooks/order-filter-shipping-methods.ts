import { SaleorSyncWebhook } from "@saleor/app-sdk/handlers/next";

import { FilterShippingMethods } from "@/generated/app-webhooks-types/order-filter-shipping-methods";
import {
  OrderFilterShippingMethodsPayloadFragment,
  OrderFilterShippingMethodsSubscriptionDocument,
} from "@/generated/graphql";
import { saleorApp } from "@/saleor-app";

/**
 * Create abstract Webhook. It decorates handler and performs security checks under the hood.
 *
 * orderFilterShippingMethodsWebhook.getWebhookManifest() must be called in api/manifest too!
 */
export const orderFilterShippingMethodsWebhook =
  new SaleorSyncWebhook<OrderFilterShippingMethodsPayloadFragment>({
    name: "Order Filter Shipping Methods",
    webhookPath: "api/webhooks/order-filter-shipping-methods",
    event: "ORDER_FILTER_SHIPPING_METHODS",
    apl: saleorApp.apl,
    query: OrderFilterShippingMethodsSubscriptionDocument,
  });

/**
 * Export decorated Next.js pages router handler, which adds extra context
 */
export default orderFilterShippingMethodsWebhook.createHandler((req, res, ctx) => {
  const {
    /**
     * Access payload from Saleor - defined above
     */
    payload,
    /**
     * Saleor event that triggers the webhook (here - ORDER_FILTER_SHIPPING_METHODS)
     */
    event,
    /**
     * App's URL
     */
    baseUrl,
    /**
     * Auth data (from APL) - contains token and saleorApiUrl that can be used to construct graphQL client
     */
    authData,
  } = ctx;

  /**
   * Perform logic based on Saleor Event payload e.g filter shipping methods
   * This is a synchronous webhook, so you can return the response directly.
   */
  console.log(`Filtering shipping methods for order id: ${payload.order?.id}`);

  const response: FilterShippingMethods = {
    excluded_methods: [],
  };

  return res.status(200).json(response);
});

/**
 * Disable body parser for this endpoint, so signature can be verified
 */
export const config = {
  api: {
    bodyParser: false,
  },
};
