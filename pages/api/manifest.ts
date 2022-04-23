import { NextApiHandler } from "next"
import { version, name } from "../../package.json"
import dotenv from 'dotenv'
import fs from 'fs/promises';

const handler: NextApiHandler = async (req, res) => {
  const content = await fs.readFile('.env', 'utf-8');
  const { APP_URL } = dotenv.parse(content);
  process.env.APP_URL = APP_URL 

  const manifest = {
    id: "saleor.app",
    version: version,
    name: name,
    permissions: ['MANAGE_ORDERS'],
    configurationUrl: `${process.env.APP_URL}/configuration`,
    tokenTargetUrl: `${process.env.APP_URL}/api/register`,
  }

  res.end(JSON.stringify(manifest))
}

export default handler
