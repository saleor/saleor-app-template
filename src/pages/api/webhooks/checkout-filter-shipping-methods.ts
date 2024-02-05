import { gql } from "urql";
import { SaleorSyncWebhook } from "@saleor/app-sdk/handlers/next";
import { saleorApp } from "../../../saleor-app";
import { CheckoutFilterShippingMethodsWebhookPayloadFragment } from "../../../../generated/graphql";

const CheckoutFilterShippingMethodsWebhookPayload = gql`
  fragment CheckoutFilterShippingMethodsWebhookPayload on CheckoutFilterShippingMethods {
    checkout{
      id
      lines{
        id
      }
    }
  }
`;

const CheckoutFilterShippingMethodsGraphqlSubscription = gql`
  ${CheckoutFilterShippingMethodsWebhookPayload}
  subscription CheckoutFilterShippingMethods {
    event {
      ...CheckoutFilterShippingMethodsWebhookPayload
    }
  }
`;

export const checkoutFilterShippingMethodsWebhook = new SaleorSyncWebhook<CheckoutFilterShippingMethodsWebhookPayloadFragment>({
  name: "CheckoutFilterShippingMethods in Saleor",
  webhookPath: "api/webhooks/checkout-filter-shipping-methods",
  event: "CHECKOUT_FILTER_SHIPPING_METHODS",
  apl: saleorApp.apl,
  query: CheckoutFilterShippingMethodsGraphqlSubscription,
});

export default checkoutFilterShippingMethodsWebhook.createHandler((req, res, ctx) => {
  const {
    /**
     * Access payload from Saleor - defined above
     */
    payload,
    /**
     * Saleor event that triggers the webhook (here - ORDER_CREATED)
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
  console.debug(`checkoutFilterShippingMethods webhook has been called`);

  return res.json({
    excluded_methods: []
  });
});

/**
 * Disable body parser for this endpoint, so signature can be verified
 */
export const config = {
  api: {
    bodyParser: false,
  },
};
