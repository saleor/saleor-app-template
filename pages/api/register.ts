import { SALEOR_DOMAIN_HEADER } from "@saleor/app-sdk/const";
import { withAuthTokenRequired, withSaleorDomainPresent } from "@saleor/app-sdk/middleware";
import { withSentry } from "@sentry/nextjs";
import type { Handler } from "retes";
import { toNextHandler } from "retes/adapter";
import { withMethod } from "retes/middleware";
import { Response } from "retes/response";

import { apl } from "../../lib/saleorApp";

const handler: Handler = async (request) => {
  const authToken = request.params.auth_token;
  const saleorDomain = request.headers[SALEOR_DOMAIN_HEADER] as string;

  try {
    await apl.set({ domain: saleorDomain, token: authToken });
  } catch {
    return Response.InternalServerError({
      success: false,
      error: {
        message: "Registration failed: could not save the auth data.",
      },
    });
  }
  return Response.OK({ success: true });
};

export default withSentry(
  toNextHandler([withMethod("POST"), withSaleorDomainPresent, withAuthTokenRequired, handler])
);
