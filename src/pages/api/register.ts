import { createAppRegisterHandler } from "@saleor/app-sdk/handlers/next";

import { saleorApp } from "../../saleor-app";

/**
 * Required endpoint, called by Saleor to install app.
 * It will exchange tokens with app, so saleorApp.apl will contain token
 * 
 * Read more: https://docs.saleor.io/docs/3.x/developer/extending/apps/developing-apps/app-sdk/api-handlers#app-register-handler-factory
 */
export default createAppRegisterHandler({
  apl: saleorApp.apl,
  allowedSaleorUrls: [
    /**
     * You may want your app to work only for certain Saleor instances.
     *
     * Your app can work for every Saleor that installs it, but you can
     * limit it here
     *
     * By default, every url is allowed.
     *
     * URL should be a full GraphQL address, usually starting with https:// and ending with /graphql/
     *
     * Alternatively pass a function
     */
  ],
  onRequestStart: async (req, ctx) => {
    /**
     * Optional function which can be used to perform some actions before the app registration
     * request is processed.
     */
    console.log("Received app registration request with saleorApiUrl: ", ctx.saleorApiUrl);
  },
  onAplSetFailed: async (req, ctx) => {
    /**
     * Optional function which can be used to handle errors when setting APL data failed.
     */
    console.log("Setting APL Auth data failed. Error: ", ctx.error);
  },
  onAuthAplSaved: async (req, ctx) => {
    /**
     * Optional function which is called after APL Auth data was saved (registration has been successful).
     */
    console.log("Successfully saved APL Auth data for saleorApiUrl: ", ctx.authData.saleorApiUrl);
  }
});
