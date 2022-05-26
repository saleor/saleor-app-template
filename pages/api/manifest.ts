import { NextApiHandler } from "next";
import { print } from "graphql/language/printer";
import fg from "fast-glob";
import path from "path";

import { version, name } from "../../package.json";
import * as GeneratedGraphQL from "../../generated/graphql";
import { getBaseURL } from "../../lib/middlewares";

const capitalize = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);
const dropFileExtension = (filename: string) => path.parse(filename).name;

const inferWebhooks = async (baseURL: string) => {
  const entries = await fg(["*.ts"], { cwd: "pages/api/webhooks" });

  return entries.map(dropFileExtension).map((name: string) => {
    const camelcaseName = name.split("-").map(capitalize).join("");

    const eventName = name.toUpperCase().replace(new RegExp("-", "g"), "_");
    let eventType: string;
    if (Object.values(GeneratedGraphQL.WebhookEventTypeAsyncEnum).includes(
      eventName as GeneratedGraphQL.WebhookEventTypeAsyncEnum
    )) {
      eventType = "asyncEvents";
    } else if (Object.values(GeneratedGraphQL.WebhookEventTypeSyncEnum).includes(
      eventName as GeneratedGraphQL.WebhookEventTypeSyncEnum
    )) {
      eventType = "syncEvents";
    } else {
      throw Error("Event type not found.");
    }

    const statement = `${camelcaseName}SubscriptionDocument`;
    let query: string;
    if (statement in GeneratedGraphQL) {
      query = print((GeneratedGraphQL as any)[statement]);
    } else {
      throw Error("Subscription not found.");
    }

    return {
      name,
      [eventType]: [eventName],
      query,
      targetUrl: `${baseURL}/api/webhooks/${name}`,
    };
  });
};

const handler: NextApiHandler = async (request, response) => {
  const baseURL = getBaseURL(request);

  const webhooks = await inferWebhooks(baseURL);

  const manifest = {
    id: "saleor.app",
    version: version,
    name: name,
    permissions: ["MANAGE_ORDERS"],
    appUrl: baseURL,
    configurationUrl: `${baseURL}/configuration`,
    tokenTargetUrl: `${baseURL}/api/register`,
    webhooks,
    extensions: [
      {
        label: "Orders in an app",
        mount: "NAVIGATION_ORDERS",
        target: "APP_PAGE",
        permissions: ["MANAGE_ORDERS"],
        url: "/orders",
      },
    ],
  };

  response.json(manifest);
};

export default handler;
