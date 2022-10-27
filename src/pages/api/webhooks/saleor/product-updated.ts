import { NextWebhookApiHandler, SaleorAsyncWebhook } from "@saleor/app-sdk/handlers/next";
import { gql } from "urql";
import { ProductUpdatedWebhookPayloadFragment } from "../../../../../generated/graphql";
import { saleorApp } from "../../../../../saleor-app";
import currentRoutePath from "../../../../lib/currentRoutePath";

/**
 * Get route path of this file
 */
const webhookPath = currentRoutePath();

/**
 * Next.js body parser has to be turned off for us to be able to access the raw request body
 * which is required to validate incoming requests
 */
export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * By using the fragment, we'll be able to get TS types for the payload
 * Since this webhook subscribes for product updates, we have to create fragment on
 * type ProductUpdated
 */
export const ProductUpdatedWebhookPayload = gql`
  fragment ProductUpdatedWebhookPayload on ProductUpdated {
    product {
      id
      name
    }
  }
`;

/**
 * Subscription query which will be used to construct response for our webhook
 */
export const ExampleProductUpdatedSubscription = gql`
  ${ProductUpdatedWebhookPayload}
  subscription ExampleProductUpdated {
    event {
      ...ProductUpdatedWebhookPayload
    }
  }
`;

/**
 * The SaleorWebhook class will help us define the webhook and provide handlers for API and manifest
 * ProductUpdatedWebhookPayloadFragment is a fragment object generated by the codegen. We are using it to
 * provide webhook payload types
 */
export const productUpdatedWebhook = new SaleorAsyncWebhook<ProductUpdatedWebhookPayloadFragment>({
  name: "Example product updated webhook",
  webhookPath,
  asyncEvent: "PRODUCT_UPDATED",
  apl: saleorApp.apl,
  subscriptionQueryAst: ExampleProductUpdatedSubscription,
});

/**
 * `productUpdatedWebhook` object created earlier provides ready to use handler which validates incoming request.
 * Also it will provide context object containing request properties and most importantly - typed payload.
 */
export const handler: NextWebhookApiHandler<ProductUpdatedWebhookPayloadFragment> = async (
  req,
  res,
  context
) => {
  const { event, authData } = context;
  console.log(`New event ${event} from the ${authData.domain} domain has been received!`);
  const { product } = context.payload;
  if (product) {
    console.log(`Payload contains ${product.name} (id: ${product.id}) product`);
  }
  res.status(200).end();
};

/**
 * Before productUpdatedWebhook.handler will execute your handler, wrapper will reject:
 * - requests with missing or invalid headers
 * - requests from Saleor instances which didn't installed this app
 * - requests which could have been tampered with. Checking their checksum gives us
 *   confidence that request source was secure Saleor instance
 */
export default productUpdatedWebhook.createHandler(handler);
