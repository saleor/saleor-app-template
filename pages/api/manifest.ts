import { NextApiHandler } from "next";

import { version, name } from "../../package.json";
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
  };

  response.json(manifest);
}

export default handler;
