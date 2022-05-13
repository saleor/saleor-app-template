import { NextApiHandler } from "next";

import { setAuthToken } from "../../lib/environment";

const handler: NextApiHandler = async (request, response) => {
  const saleor_domain = request.headers["saleor-domain"];
  if (!saleor_domain) {
    response.status(400).json({ success: false, message: "Missing saleor domain token." });
    return;
  }

  const auth_token = request.body?.auth_token as string;
  if (!auth_token) {
    response.status(400).json({ success: false, message: "Missing auth token." });
    return;
  }

  await setAuthToken(auth_token);
  response.json({ success: true });
};

export default handler;
