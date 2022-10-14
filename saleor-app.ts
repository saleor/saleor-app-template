import { SaleorApp } from "@saleor/app-sdk";
import { FileAPL, VercelAPL } from "@saleor/app-sdk/APL";

const isVercel = process.env.VERCEL === "1";

/**
 * For local development store auth data in the `.auth-data.json`.
 * For app deployment on Vercel with Saleor CLI, use vercelAPL.
 *
 * To read more about storing auth data, read the
 * [APL documentation](https://github.com/saleor/saleor-app-sdk/blob/main/docs/apl.md)
 */
export const apl = isVercel ? new VercelAPL() : new FileAPL();

export const saleorApp = new SaleorApp({
  apl,
});
