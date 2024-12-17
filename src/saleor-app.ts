import { SaleorApp } from "@saleor/app-sdk/saleor-app";
import { APL, FileAPL, UpstashAPL } from "@saleor/app-sdk/APL";
import { VercelKvApl } from "@saleor/app-sdk/APL/vercel-kv";

/**
 * By default auth data are stored in the `.auth-data.json` (FileAPL).
 * For multi-tenant applications and deployments please use UpstashAPL.
 *
 * To read more about storing auth data, read the
 * [APL documentation](https://github.com/saleor/saleor-app-sdk/blob/main/docs/apl.md)
 */
export let apl: APL;
switch (process.env.APL) {
  case "vercel-kv":
    /**
     * Following envs are required
     *
     * KV_URL
     * KV_REST_API_URL
     * KV_REST_API_TOKEN
     * KV_REST_API_READ_ONLY_TOKEN
     * KV_STORAGE_NAMESPACE
     *
     * Additionally, you need
     * pnpm i @vercel/kv
     */
    apl = new VercelKvApl();
    break;
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
