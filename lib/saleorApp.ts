import { createApp } from "../sdk/config";
import { Manifest } from "../sdk/types/manifest";
import { prismaAPL } from "./prismaAPL";

export const SaleorAppConfig = createApp({
  // auth: environmentVariablesAPL,
  auth: prismaAPL,
  manifest: (baseUrl: string): Manifest => ({
    id: "saleor.app",
    version: "0.0.1",
    name: "New Saleor App",
    about: "Short description of your app",
    permissions: ["MANAGE_ORDERS", "MANAGE_PRODUCTS"],
    appUrl: baseUrl,
    tokenTargetUrl: `${baseUrl}/api/register`,
    webhooks: [
      {
        events: ["PRODUCT_UPDATED"],
        name: "Handle_product_update",
        isActive: true,
        targetUrl: `${baseUrl}/api/webhooks/product-updated`,
        query: "subscription{event{...on ProductUpdated{product{id name}}}}",
        // todo: ideally query will be defined alongside the webhook handler.
        // The change will be a move towards configuration over convention.
        // query: print(
        //   gql`
        //     subscription {
        //       event {
        //         ... on ProductUpdated {
        //           product {
        //             id
        //             name
        //           }
        //         }
        //       }
        //     }
        //   `
        // ),
      },
    ],
    extensions: [
      {
        label: "Guest orders",
        mount: "NAVIGATION_ORDERS",
        target: "APP_PAGE",
        permissions: ["MANAGE_ORDERS"],
        url: "/orders",
      },
    ],
  }),
});
