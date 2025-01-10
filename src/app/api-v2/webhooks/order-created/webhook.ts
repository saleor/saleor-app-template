import { gql } from "urql";
import { OrderCreatedWebhookPayloadFragment } from "../../../../../generated/graphql";
import { saleorApp } from "../../../../saleor-app";
import { SaleorAsyncWebhook } from "@saleor/app-sdk/handlers/fetch-api";

/**
 * Example payload of the webhook. It will be transformed with graphql-codegen to Typescript type: OrderCreatedWebhookPayloadFragment
 */
const OrderCreatedWebhookPayload = gql`
  fragment OrderCreatedWebhookPayload on OrderCreated {
    order {
      userEmail
      id
      number
      user {
        email
        firstName
        lastName
      }
    }
  }
`;

/**
 * Top-level webhook subscription query, that will be attached to the Manifest.
 * Saleor will use it to register webhook.
 */
const OrderCreatedGraphqlSubscription = gql`
  # Payload fragment must be included in the root query
  ${OrderCreatedWebhookPayload}
  subscription OrderCreated {
    event {
      ...OrderCreatedWebhookPayload
    }
  }
`;

/**
 * Create abstract Webhook. It decorates handler and performs security checks under the hood.
 *
 * orderCreatedWebhook.getWebhookManifest() must be called in api/manifest too!
 */
export const orderCreatedWebhook = new SaleorAsyncWebhook<OrderCreatedWebhookPayloadFragment>({
  name: "Order Created in Saleor",
  webhookPath: "api-v2/webhooks/order-created",
  event: "ORDER_CREATED",
  apl: saleorApp.apl,
  query: OrderCreatedGraphqlSubscription,
});
