import { NextApiRequest, NextApiResponse } from "next"
import { client } from "../../lib/graphql"

const handler = async (request: NextApiRequest, res: NextApiResponse): Promise<undefined> => {
  const saleor_domain = request.headers['x-saleor-domain']
  if (!saleor_domain) {
    res.statusCode = 400
    res.end(
      JSON.stringify({
        success: false,
        message: "Missing saleor domain token.",
      })
    )
    return
  }
  const auth_token = request.body?.auth_token as string
  if (!auth_token) {
    res.statusCode = 400
    res.end(JSON.stringify({ success: false, message: "Missing auth token." }))
    return
  }

  res.end(JSON.stringify({ success: true }))
}

export default handler
