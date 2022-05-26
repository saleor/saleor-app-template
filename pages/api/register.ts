import type { Handler } from "retes";

import { Response } from 'retes/response';
import { toNextHandler } from "retes/adapter";
import { withMethod } from "retes/middleware";

import { setAuthToken } from "../../lib/environment";
import { withAuthTokenRequired, withSaleorDomainPresent } from "@saleor/app-sdk/middleware";

const handler: Handler = async (request) => {

  const auth_token = request.params.auth_token;
  await setAuthToken(auth_token);

  return Response.OK({ success: true });
};

export default toNextHandler([
  withMethod('POST'),
  withSaleorDomainPresent,
  withAuthTokenRequired,
  handler
]);