import { SALEOR_DOMAIN_HEADER } from "@saleor/app-sdk/const";
import { withSaleorDomainPresent } from "@saleor/app-sdk/middleware";
import type { Middleware } from "retes";
import { Response } from "retes/response";

import { getEnvVars } from "./environment";

export const withSaleorDomainMatch: Middleware = (handler) =>
  withSaleorDomainPresent(async (request) => {
    const { SALEOR_DOMAIN } = await getEnvVars();

    if (SALEOR_DOMAIN === undefined) {
      return Response.InternalServerError({
        success: false,
        message: "Missing SALEOR_DOMAIN environment variable.",
      });
    }

    if (SALEOR_DOMAIN !== request.headers[SALEOR_DOMAIN_HEADER]) {
      return Response.BadRequest({
        success: false,
        message: `Invalid ${SALEOR_DOMAIN_HEADER} header.`,
      });
    }

    return handler(request);
  });
