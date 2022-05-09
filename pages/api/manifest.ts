import { NextApiHandler } from "next";
import { print } from "graphql/language/printer";

import { version, name } from "../../package.json";
import { OrderCreatedSubscriptionDocument } from "../../generated/graphql";
import { getBaseURL } from "../../lib/middlewares";


const handler: NextApiHandler = async (request, response) => {
  const baseURL = getBaseURL(request);

  const manifest = {
    id: "saleor.app",
    version: version,
    name: name,
    permissions: ["MANAGE_ORDERS"],
    configurationUrl: `${baseURL}/configuration`,
    tokenTargetUrl: `${baseURL}/api/register`,
    webhooks: [
      {
        name: "order-created",
        events: ["ORDER_CREATED"],
        query: print(OrderCreatedSubscriptionDocument),
        targetUrl: `${baseURL}/api/webhooks/order-created`,
        isActive: true,
      },
    ],
  };

  response.json(manifest);
}

export default handler;
