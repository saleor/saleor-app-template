import { SALEOR_DOMAIN_HEADER } from "@saleor/app-sdk/const";
import { withAuthTokenRequired, withSaleorDomainPresent } from "@saleor/app-sdk/middleware";
import { withSentry } from "@sentry/nextjs";
import { setConfiguration } from "./../../lib/configuration";
import type { Handler } from "retes";
import { toNextHandler } from "retes/adapter";
import { withMethod } from "retes/middleware";
import { Response } from "retes/response";

const handler: Handler = async (request) => {
  const authToken = request.params.auth_token;
  const saleorDomain = request.headers[SALEOR_DOMAIN_HEADER];

  await setConfiguration({ domain: saleorDomain, token: authToken });

  return Response.OK({ success: true });
};

export default withSentry(
  toNextHandler([withMethod("POST"), withSaleorDomainPresent, withAuthTokenRequired, handler])
);
