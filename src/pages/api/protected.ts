import { createProtectedHandler } from "@saleor/app-sdk/handlers/next";
import { apl } from "@/saleor-app";

/**
 * Will be available only from the Dashboard, and only for users with the MANAGE_ORDERS permission.
 */
const handler = createProtectedHandler(
  (req, res, { user, baseUrl, authData }) => {
    return res.json({
      message: "OK!",
    });
  },
  apl,
  ["MANAGE_ORDERS"]
);

export default handler;
