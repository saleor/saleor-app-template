import { withSaleorEventMatch, withWebhookSignatureVerified } from "@saleor/app-sdk/middleware";
import { withSentry } from "@sentry/nextjs";
import type { Handler } from "retes";
import { toNextHandler } from "retes/adapter";
import { Response } from "retes/response";

const handler: Handler = async (request) => {
  //
  // Your logic goes here
  //
  console.debug("Received order webhook.");
  console.debug(request.body);

  return Response.OK({ success: true });
};

export default withSentry(
  toNextHandler([withSaleorEventMatch("order_created"), withWebhookSignatureVerified(), handler])
);

export const config = {
  api: {
    bodyParser: false,
  },
};
