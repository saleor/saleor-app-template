import { NextApiRequest, NextApiResponse } from "next";

import { SaleorAppConfig } from "../../../lib/saleorApp";

export const productUpdatedHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.debug("Webhook received!");
  await SaleorAppConfig.webhooks.process(req, res);

  console.debug("Validated", req.body);
  res.status(200).json({ success: true });
};

export default productUpdatedHandler;

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };
