import { createProtectedHandler, ProtectedHandlerContext } from "@saleor/app-sdk/handlers/next";
import { NextApiRequest, NextApiResponse } from "next";
import { saleorApp } from "../../../saleor-app";

/**
 * Let's create a new route we would like to share only with dashboard users.
 * You may want to use it for example to modify application configuration.
 *
 * In this example we'll simply return data we have about the request, if we were
 * able to validate the request.
 *
 * You can put your endpoint logic here.
 */
export const handler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  ctx: ProtectedHandlerContext
) => {
  /**
   * Context which is the result of the validation has instance of AuthData, which can be used
   * to query Saleor API on behalf of the application.
   *
   * This time we only want to return success message to the frontend part.
   */
  res.status(200).json({ appUrl: ctx.baseUrl, saleorDomain: ctx.authData.domain });
};

/**
 * `createProtectedHandler` will check if:
 * - the request has `saleor-domain` header
 * - the domain has been registered, with help of the APL
 * - the request has `authorization-bearer`
 * - the auth token is a valid JWT token created by the Saleor running on the given domain
 *
 * If any of the requirements is failed, an error response will be returned.
 * Otherwise, provided handler function fill be called.
 */
export default createProtectedHandler(handler, saleorApp.apl);
