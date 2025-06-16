import { NextApiHandler } from "next";
import { ExtensionPOSTAttributes } from "@saleor/app-sdk/types";
import { verifyJWT } from "@saleor/app-sdk/auth";
import { createClient } from "@/lib/create-graphq-client";
import { ProductTimestampsDocument } from "../../../generated/graphql";

const handler: NextApiHandler = async (req, res) => {
  const { appId, accessToken, saleorApiUrl, ...contextParams } =
    req.body as ExtensionPOSTAttributes;

  res.setHeader("Content-Type", "text/plain");

  try {
    await verifyJWT({
      appId,
      token: accessToken,
      saleorApiUrl,
    });
  } catch (e) {
    return res.status(401).send("Not authorized");
  }

  if (!contextParams.productId) {
    return res.status(200).send("Missing product ID");
  }

  const client = createClient(saleorApiUrl, async () => ({ token: accessToken }));
  const productTimestamps = await client.query(ProductTimestampsDocument, {
    id: contextParams.productId,
  });

  if (productTimestamps.data?.product) {
    return res
      .status(200)
      .send(
        `This product was created at ${productTimestamps.data.product.created} and last updated at ${productTimestamps.data.product.updatedAt}`
      );
  }
};

export default handler;
