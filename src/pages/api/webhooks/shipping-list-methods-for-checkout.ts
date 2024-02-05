import { gql } from "urql";
import { SaleorSyncWebhook } from "@saleor/app-sdk/handlers/next";
import { saleorApp } from "../../../saleor-app";
import { ShippingListMethodsForCheckoutWebhookPayloadFragment } from "../../../../generated/graphql";

const ShippingListMethodsForCheckoutWebhookPayload = gql`
  fragment ShippingListMethodsForCheckoutWebhookPayload on ShippingListMethodsForCheckout {
    checkout{
      id
      lines{
        id
      }
    }
  }
`;

const ShippingListMethodsForCheckoutGraphqlSubscription = gql`
  # Payload fragment must be included in the root query
  ${ShippingListMethodsForCheckoutWebhookPayload}
  subscription ShippingListMethodsForCheckout {
    event {
      ...ShippingListMethodsForCheckoutWebhookPayload
    }
  }
`;

export const shippingListMethodsForCheckoutWebhook = new SaleorSyncWebhook<ShippingListMethodsForCheckoutWebhookPayloadFragment>({
  name: "ShippingListMethodsForCheckout in Saleor",
  webhookPath: "api/webhooks/shipping-list-methods-for-checkout",
  event: "SHIPPING_LIST_METHODS_FOR_CHECKOUT",
  apl: saleorApp.apl,
  query: ShippingListMethodsForCheckoutGraphqlSubscription,
});

export default shippingListMethodsForCheckoutWebhook.createHandler((req, res, ctx) => {
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
  console.debug(`shippingListMethodsForCheckout webhook has been called`);

  return res.json([
    {
    "id": "method-1-from-shipping-app",
    "name": "Shipping app method 1",
    "amount": 10.0,
    "currency": "USD"
  },
  ]);
});

/**
 * Disable body parser for this endpoint, so signature can be verified
 */
export const config = {
  api: {
    bodyParser: false,
  },
};
