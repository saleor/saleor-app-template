import { NextApiHandler } from "next"
import { version, name } from "../../package.json"

const handler: NextApiHandler = (req, res) => {
  const manifest = {
    id: "saleor.app",
    version: version,
    name: name,
    permissions: ['MANAGE_ORDERS'],
    configurationUrl: `${process.env.NEXT_PUBLIC_APP_URL}/configuration`,
    tokenTargetUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/register`,
  }

  res.end(JSON.stringify(manifest))
}

export default handler
