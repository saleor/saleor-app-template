import { SaleorApp } from "@saleor/app-sdk/saleor-app";
import { APL, FileAPL, UpstashAPL } from "@saleor/app-sdk/APL";

/**
 * By default auth data are stored in the `.auth-data.json` (FileAPL).
 * For multi-tenant applications and deployments please use UpstashAPL.
 *
 * To read more about storing auth data, read the
 * [APL documentation](https://docs.saleor.io/docs/3.x/developer/extending/apps/developing-apps/app-sdk/apl)
 */
export let apl: APL;
switch (process.env.APL) {
  case "upstash":
    // Require `UPSTASH_URL` and `UPSTASH_TOKEN` environment variables
    apl = new UpstashAPL();
    break;
  default:
    apl = new FileAPL();
}

export const saleorApp = new SaleorApp({
  apl,
});
