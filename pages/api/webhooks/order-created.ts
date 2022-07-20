import type { Handler } from "retes";

import { Response } from "retes/response";
import { toNextHandler } from "retes/adapter";
import {
  withSaleorEventMatch,
  withWebhookSignatureVerified,
} from "@saleor/app-sdk/middleware";

import { withSaleorDomainMatch } from "../../../lib/middlewares";
import { WebhookEventTypeEnum } from "../../../generated/graphql";

const handler: Handler = async (request) => {
  //
  // Your logic goes here
  //

  return Response.OK({ success: true });
};

export default toNextHandler([
  withSaleorDomainMatch,
  withSaleorEventMatch<WebhookEventTypeEnum>("order_created"),
  withWebhookSignatureVerified(),
  handler,
]);

export const config = {
  api: {
    bodyParser: false,
  },
};
