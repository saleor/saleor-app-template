import { SALEOR_DOMAIN_HEADER } from "@saleor/app-sdk/const";
import { withAuthTokenRequired, withSaleorDomainPresent } from "@saleor/app-sdk/middleware";
import { withSentry } from "@sentry/nextjs";
import type { Handler } from "retes";
import { toNextHandler } from "retes/adapter";
import { withMethod } from "retes/middleware";
import { Response } from "retes/response";

import { setEnvVars } from "../../lib/environment";

const handler: Handler = async (request) => {
  const authToken = request.params.auth_token;
  const saleorDomain = request.headers[SALEOR_DOMAIN_HEADER];

  try {
    await setEnvVars([
      {
        key: "SALEOR_AUTH_TOKEN",
        value: authToken,
      },
      {
        key: "SALEOR_DOMAIN",
        value: saleorDomain,
      },
    ]);
  } catch {
    return Response.InternalServerError({
      success: false,
      message: "Registration failed: could not save the data.",
    });
  }
  return Response.OK({ success: true });
};

export default withSentry(
  toNextHandler([withMethod("POST"), withSaleorDomainPresent, withAuthTokenRequired, handler])
);
