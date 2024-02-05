import { gql } from "urql";
import { SaleorSyncWebhook } from "@saleor/app-sdk/handlers/next";
import { saleorApp } from "../../../saleor-app";
import { OrderFilterShippingMethodsWebhookPayloadFragment } from "../../../../generated/graphql";

const OrderFilterShippingMethodsWebhookPayload = gql`
  fragment OrderFilterShippingMethodsWebhookPayload on OrderFilterShippingMethods {
    order{
      id
      lines{
        id
      }
    }
  }
`;

const OrderFilterShippingMethodsGraphqlSubscription = gql`
  # Payload fragment must be included in the root query
  ${OrderFilterShippingMethodsWebhookPayload}
  subscription OrderFilterShippingMethods {
    event {
      ...OrderFilterShippingMethodsWebhookPayload
    }
  }
`;

export const orderFilterShippingMethodsWebhook = new SaleorSyncWebhook<OrderFilterShippingMethodsWebhookPayloadFragment>({
  name: "OrderFilterShippingMethods in Saleor",
  webhookPath: "api/webhooks/order-filter-shipping-methods",
  event: "ORDER_FILTER_SHIPPING_METHODS",
  apl: saleorApp.apl,
  query: OrderFilterShippingMethodsGraphqlSubscription,
});

export default orderFilterShippingMethodsWebhook.createHandler((req, res, ctx) => {
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
  console.debug(`orderFilterShippingMethods webhook has been called`);

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
