import { NextApiHandler } from "next";

import { webhookMiddleware } from "../../../lib/middlewares";

const expectedEvent = "order_created";

const handler: NextApiHandler = async (request, response) => {
  console.log(request.body);

  webhookMiddleware(request, response, expectedEvent);

  response.json({ success: true });
};

export default handler;
