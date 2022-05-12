import { NextApiHandler } from "next";
import { print } from "graphql/language/printer";
import fg from 'fast-glob';
import path from 'path';

import { version, name } from "../../package.json";
import * as GeneratedGraphQL from "../../generated/graphql";
import { getBaseURL } from "../../lib/middlewares";

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

const inferWebhooks = async (baseURL: string) => {
  const entries = await fg(['*.ts'], { cwd: 'pages/api/webhooks' });

  const dropFileExtension = (filename: string) => path.parse(filename).name;
  const r = entries.map(dropFileExtension).map((name: string) => {

    const camelcaseName = name.split('-').map(capitalize).join('');
    const statement = `${camelcaseName}SubscriptionDocument`;
    const query = statement in  GeneratedGraphQL ? print((GeneratedGraphQL as any)[statement]) : '';

    return {
      name,
      asyncEvents: [name.toUpperCase().replace("-", "_")],
      query, 
      targetUrl: `${baseURL}/api/webhooks/${name}`,
      isActive: true,
    }
  })

  return r
}


const handler: NextApiHandler = async (request, response) => {
  const baseURL = getBaseURL(request);

  const webhooks = await inferWebhooks(baseURL);

  const manifest = {
    id: "saleor.app",
    version: version,
    name: name,
    permissions: ["MANAGE_ORDERS"],
    configurationUrl: `${baseURL}/configuration`,
    tokenTargetUrl: `${baseURL}/api/register`,
    webhooks,
  };

  response.json(manifest);
}

export default handler;
