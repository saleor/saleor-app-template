import { SALEOR_DOMAIN_HEADER } from "@saleor/app-sdk/const";
import { withJWTVerified, withRegisteredSaleorDomainHeader } from "@saleor/app-sdk/middleware";
import type { Handler } from "retes";
import { toNextHandler } from "retes/adapter";
import { Response } from "retes/response";

import { getAppMetadataValue } from "../../../lib/get-app-metadata-value";
import { apl } from "../../../lib/apl";
import { getAppIdFromApi } from "../../../lib/get-app-id-from-api";

const handler: Handler = async (request) => {
  const saleorDomain = request.headers[SALEOR_DOMAIN_HEADER] as string;

  let numberOfOrders;
  try {
    numberOfOrders = await getAppMetadataValue(saleorDomain, "NUMBER_OF_ORDERS");
  } catch (e: unknown) {
    const error = e as Error;
    console.error(error);
    return Response.InternalServerError({
      success: false,
      message: error.message,
    });
  }

  return Response.OK({ success: true, data: { number_of_orders: numberOfOrders } });
};

export default toNextHandler([
  withRegisteredSaleorDomainHeader({ apl }),
  withJWTVerified(getAppIdFromApi),
  handler,
]);
