import { SALEOR_DOMAIN_HEADER } from "@saleor/app-sdk/const";
import { withSaleorDomainPresent } from "@saleor/app-sdk/middleware";
import type { Middleware } from "retes";
import { Response } from "retes/response";

import { getConfiguration } from "./configuration";

export const withSaleorDomainMatch: Middleware = (handler) =>
  withSaleorDomainPresent(async (request) => {
    const requestDomain = request.headers[SALEOR_DOMAIN_HEADER];
    try {
      getConfiguration(requestDomain);
    } catch {
      return Response.BadRequest({
        success: false,
        message: `App is not registered for ${requestDomain}`,
      });
    }

    return handler(request);
  });
