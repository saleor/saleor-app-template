import { NextApiHandler } from "next";

import { webhookMiddleware } from "../../../lib/middlewares";
import MiddlewareError from "../../../utils/MiddlewareError";

const expectedEvent = "order_created";

const handler: NextApiHandler = async (request, response) => {
  console.log(request.body);

  try {
    webhookMiddleware(request, expectedEvent);
  } catch (e: unknown) {
    const error = e as MiddlewareError;

    console.error(error);
    response
      .status(error.statusCode)
      .json({ success: false, message: error.message });
    return;
  }

  console.info("Middleware checks were successful!");

  response.json({ success: true });
};

export default handler;
