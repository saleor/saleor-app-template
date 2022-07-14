import type { Handler } from "retes";

import { Response } from "retes/response";
import { toNextHandler } from "retes/adapter";
import {
  withSaleorEventMatch,
  withWebhookSignatureVerified,
} from "@saleor/app-sdk/middleware";
import { withSentry } from "@sentry/nextjs";

import { withSaleorDomainMatch } from "../../../lib/middlewares";

const handler: Handler = async (request) => {
  //
  // Your logic goes here
  //

  return Response.OK({ success: true });
};

export default withSentry(
  toNextHandler([
    withSaleorDomainMatch,
    withSaleorEventMatch("order_created"),
    withWebhookSignatureVerified(),
    handler,
  ])
);

export const config = {
  api: {
    bodyParser: false,
  },
};
