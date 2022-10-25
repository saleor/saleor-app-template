import { NextApiHandler } from "next";
import { SALEOR_DOMAIN_HEADER } from "@saleor/app-sdk/const";
import { saleorApp } from "../../../../saleor-app";
import { createClient } from "../../../lib/graphql";
import { CreateGiftCardDocument } from "../../../../generated/graphql";

/**
 * To ensure this endpoint will not be called by unauthorized users,
 * check secret that should be attached to the request.
 *
 * Check external service how secrets are attached
 *
 * In this example it will be a header.
 */
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
/**
 * Assume this is payload that will be sent by external service
 */
type ExternalServiceGiftCardBody = {
  amount: number;
  currency: string;
};

const validateBody = (body: any): body is ExternalServiceGiftCardBody => {
  return typeof body?.amount === "number" && typeof body?.currency === "string";
};

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST is supported!" });
  }

  if (!validateBody(req.body)) {
    return res.status(400).send("Invalid body payload");
  }

  if (req.headers["webhook-secret"] !== WEBHOOK_SECRET) {
    return res.status(401).send("Not allowed");
  }

  const body = req.body;

  /**
   * External service must inform App what Saleor domain should be affected
   */
  const saleorDomain = req.headers[SALEOR_DOMAIN_HEADER] as string;

  /**
   * App must be installed first, otherwise apl will not find token
   */
  const authData = await saleorApp.apl.get(saleorDomain);

  if (!authData) {
    return res.status(403).json({
      error: `Could not find auth data for the domain ${saleorDomain}. Check if app is installed.`,
    });
  }

  const client = createClient(`https://${saleorDomain}/graphql/`, async () =>
    Promise.resolve({ token: authData.token })
  );

  try {
    const { data, error } = await client
      .mutation(CreateGiftCardDocument, {
        input: {
          isActive: true,
          balance: {
            amount: body.amount,
            currency: body.currency,
          },
        },
      })
      .toPromise();

    /**
     * If mutation is successful, id should be available. Return it to external service with status 200
     */
    if (data?.giftCardCreate?.giftCard?.id) {
      return res.status(200).send({ id: data?.giftCardCreate?.giftCard?.id });
    }

    /**
     * If connection fails, return 500
     */
    if (error) {
      console.error(error);

      return res.status(500).send("Connection to Saleor failed, check logs");
    }

    /**
     * If mutation fails, return 500 and message from Saleor
     */
    if (data?.giftCardCreate?.errors && data.giftCardCreate.errors.length > 0) {
      console.error(error);

      return res
        .status(500)
        .send("GiftCard create mutation failed: " + data.giftCardCreate.errors[0].message);
    }
  } catch (e: unknown) {
    console.error(e);

    return res.status(500).send("Something went wrong.");
  }
};

export default handler;
