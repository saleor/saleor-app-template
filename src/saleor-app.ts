import { APL } from "@saleor/app-sdk/APL";
import { SaleorApp } from "@saleor/app-sdk/saleor-app";
import { FileAPL } from "@saleor/app-sdk/APL/file";

/**
 * By default auth data are stored in the `.auth-data.json` (FileAPL).
 * For multi-tenant applications and deployments please use UpstashAPL.
 *
 * To read more about storing auth data, read the
 * [APL documentation](https://github.com/saleor/saleor-app-sdk/blob/main/docs/apl.md)
 */
export let apl: APL;

switch (process.env.APL) {
  /**
   * Depending on env variables, chose what APL to use.
   * To reduce the footprint, import only these needed
   *
   * TODO: See docs
   */
  default:
    apl = new FileAPL();
}

export const saleorApp = new SaleorApp({
  apl,
});
