import type { NextApiRequest, NextApiResponse } from "next";
import { SALEOR_DOMAIN_HEADER } from "@saleor/app-sdk/const";
import { SettingsManager } from "@saleor/app-sdk/settings-manager";

import { createClient } from "../../lib/graphql";
import { createSettingsManager } from "../../lib/metadata";
import { saleorApp } from "../../../saleor-app";

export interface SettingsUpdateApiRequest {
  name: string;
  secret: string;
}

export interface SettingsApiResponse {
  success: boolean;
  data?: {
    name: string;
    secret: string;
  };
}

const obfuscateSecret = (secret: string) => {
  return "*".repeat(secret.length - 4) + secret.substring(secret.length - 4);
};

const sendResponse = async (
  res: NextApiResponse<SettingsApiResponse>,
  statusCode: number,
  settings: SettingsManager,
  domain: string
) => {
  res.status(statusCode).json({
    success: statusCode === 200,
    data: {
      name: (await settings.get("name")) || "",
      secret: obfuscateSecret((await settings.get("secret", domain)) || ""),
    },
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SettingsApiResponse>
) {
  const saleorDomain = req.headers[SALEOR_DOMAIN_HEADER] as string;
  const authData = await saleorApp.apl.get(saleorDomain);

  if (!authData) {
    console.debug(`Could not find auth data for the domain ${saleorDomain}.`);
    res.status(401).json({ success: false });
    return;
  }

  const client = createClient(`https://${saleorDomain}/graphql/`, async () =>
    Promise.resolve({ token: authData.token })
  );

  const settings = createSettingsManager(client);

  if (req.method === "GET") {
    await sendResponse(res, 200, settings, saleorDomain);
    return;
  } else if (req.method === "POST") {
    const { name, secret } = req.body as SettingsUpdateApiRequest;

    if (name && secret) {
      await settings.set({ key: "name", value: name });
      await settings.set({ key: "secret", value: secret, domain: saleorDomain });
      await sendResponse(res, 200, settings, saleorDomain);
      return;
    } else {
      console.log("Missing Settings Values");
      await sendResponse(res, 400, settings, saleorDomain);
      return;
    }
  }
  res.status(405).end();
  return;
}
