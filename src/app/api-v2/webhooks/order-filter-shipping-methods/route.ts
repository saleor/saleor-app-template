import { orderFilterShippingMethodsWebhook } from "./webhook";

export const POST = orderFilterShippingMethodsWebhook.createHandler((request, ctx) => {
  const { payload } = ctx;
  console.log("Order Filter Shipping Methods Webhook received with: ", payload);
  return new Response("{}", { status: 200 })
});
