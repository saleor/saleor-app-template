import { NextApiHandler } from "next";

import { domainMiddleware, jwtVerifyMiddleware } from "../../../lib/middlewares";
import MiddlewareError from "../../../utils/MiddlewareError";
import { getValue } from "../../../lib/metadata";

const handler: NextApiHandler = async (request, response) => {
  let saleorDomain: string;
  try {
    saleorDomain = domainMiddleware(request) as string;
    await jwtVerifyMiddleware(request);
  }
  catch (e: unknown) {
    const error = e as MiddlewareError;

    console.error(error);
    response
      .status(error.statusCode)
      .json({ success: false, message: error.message });
    return;
  }

  let number_of_orders;
  try {
    number_of_orders = await getValue(saleorDomain, "NUMBER_OF_ORDERS");
  } catch (e: unknown) {
    const error = e as Error;

    console.error(error);
    response
      .status(500)
      .json({ success: false, message: error.message });
    return;
  }


  response.json({ success: true, data: { number_of_orders } });
};

export default handler;
