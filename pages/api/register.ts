import type { Handler } from "retes";

import { Response } from "retes/response";
import { toNextHandler } from "retes/adapter";
import { withMethod } from "retes/middleware";

import { setEnvVars } from "../../lib/environment";
import { SALEOR_DOMAIN_HEADER } from "@saleor/app-sdk/const";
import {
  withAuthTokenRequired,
  withSaleorDomainPresent,
} from "@saleor/app-sdk/middleware";

const handler: Handler = async (request) => {
  const authToken = request.params.auth_token;
  const saleorDomain = request.headers[SALEOR_DOMAIN_HEADER];

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

  return Response.OK({ success: true });
};

export default toNextHandler([
  withMethod("POST"),
  withSaleorDomainPresent,
  withAuthTokenRequired,
  handler,
]);
