import { SALEOR_DOMAIN_HEADER } from "@saleor/app-sdk/const";
import { IncomingMessage, ServerResponse } from "http";

import { environmentVariablesAPL } from "./APLs/environmentVariablesAPL";
import { defaultManifestHandler, defaultRegisterHandler, returnErrorResponse } from "./handlers";
import { AppConf } from "./types/configuration";
import { Manifest, WebhookManifest } from "./types/manifest";
import { validateExistingRegistration, validateMethod, validateWebhookHeaders } from "./validators";

export const defaultAppConf: AppConf = {
  auth: environmentVariablesAPL,
  manifest: (baseUrl: string): Manifest => ({
    id: "saleor.app",
    version: "0.0.1",
    name: "New Saleor App",
    about: "Short description of your app",
    permissions: [],
    appUrl: baseUrl,
    tokenTargetUrl: `${baseUrl}/api/register`,
    webhooks: [],
    extensions: [],
  }),
};

export interface RegisterWebhooksProps extends WebhookManifest {
  handler: (req: IncomingMessage, res: ServerResponse) => Promise<void>;
}

export const createApp = (appConf?: AppConf) => {
  const conf = { ...defaultAppConf, ...appConf };

  if (!conf.manifest) {
    throw new Error("Configuration error - missing manifest");
  }

  return {
    ...conf,
    registerHandler: async (req: IncomingMessage, res: ServerResponse) =>
      defaultRegisterHandler(req, res, conf.auth),
    manifestHandler: async (req: IncomingMessage, res: ServerResponse) => {
      await defaultManifestHandler(req, res, conf.manifest!);
    },
    restrictedPaths: {
      process: async (req: IncomingMessage, res: ServerResponse) => {
        // Security checks for restricted paths, like configuration API for the installed apps
        console.debug("Processing request to restricted resource:", req.url);

        const saleorDomain = req.headers[SALEOR_DOMAIN_HEADER];
        const domainError = await validateExistingRegistration(saleorDomain as string, conf.auth);
        if (domainError) {
          returnErrorResponse(res, domainError);
          return;
        }

        // todo: refactor withJWTVerified to be used here

        console.debug("Request accepted.");
      },
    },
    webhooks: {
      registerHandler: (props: RegisterWebhooksProps) => {
        // todo: Function will be required by "catch all"
        console.debug("add new webhook", props);
      },
      process: async (req: IncomingMessage, res: ServerResponse) => {
        // Check validity of the incoming webhook request. In case of issues will return response with proper code and message.
        console.debug("Processing webhook:", req.url);

        const methodError = await validateMethod(req.method!, "POST");
        if (methodError) {
          returnErrorResponse(res, methodError);
          return;
        }

        const headersError = await validateWebhookHeaders(req.headers);
        if (headersError) {
          returnErrorResponse(res, headersError);
          return;
        }

        console.debug("Webhook accepted.");
      },
    },
  };
};
