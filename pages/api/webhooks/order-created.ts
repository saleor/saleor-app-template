import type { Handler } from "retes";

import { Response } from "retes/response";
import { toNextHandler } from "retes/adapter";
import {
  withSaleorEventMatch,
  withWebhookSignatureVerified,
} from "@saleor/app-sdk/middleware";

import { withSaleorDomainMatch } from "../../../lib/middlewares";

const handler: Handler = async (request) => {
  //
  // Your logic goes here
  //

  return Response.OK({ success: true });
};

export default toNextHandler([
  withSaleorDomainMatch,
  withSaleorEventMatch("order_created"),
  withWebhookSignatureVerified(),
  handler,
]);
