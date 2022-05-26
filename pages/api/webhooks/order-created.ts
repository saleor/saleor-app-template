import type { Handler } from "retes";

import { Response } from 'retes/response';
import { toNextHandler } from "retes/adapter";
import { 
  withSaleorDomainPresent, 
  withSaleorEventMatch 
} from "@saleor/app-sdk/middleware";

const handler: Handler = async (request) => {

  //
  // Your logic goes here
  //

  return Response.OK({ success: true });
};

export default toNextHandler([
  withSaleorDomainPresent,
  withSaleorEventMatch("order_created"),
  handler
]);

