import { toNextHandler } from "retes/adapter";
import type { Handler } from "retes";
import { Response } from "retes/response";

import { withSaleorDomainMatch, withJWTVerified } from "../../../lib/middlewares";
import { getValue } from "../../../lib/metadata";
import { SALEOR_DOMAIN_HEADER } from "@saleor/app-sdk/const";

const handler: Handler = async (request) => {
  const saleorDomain = request.headers[SALEOR_DOMAIN_HEADER];

  let number_of_orders;
  try {
    number_of_orders = await getValue(saleorDomain, "NUMBER_OF_ORDERS");
  } catch (e: unknown) {
    const error = e as Error;
    console.error(error);
    return Response.InternalServerError({
      success: false,
      message: error.message,
    });
  }

  return Response.OK({ success: true, data: { number_of_orders } });
};

export default toNextHandler([
  withSaleorDomainMatch,
  withJWTVerified,
  handler,
]);
