import { NextApiHandler } from "next";
import fetch from "node-fetch";

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

  if (process.env.VERCEL === "1") {
    await fetch(
      process.env.SALEOR_MARKETPLACE_REGISTER_URL as string,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auth_token,
          marketplace_token: process.env.SALEOR_MARKETPLACE_TOKEN,
        }),
      },
    );
  }

  response.json({ success: true });
};

export default handler;
