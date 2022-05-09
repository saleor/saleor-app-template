import { NextApiHandler } from "next";

const handler: NextApiHandler = async (request, response) => {
  console.log(request.body);

  response.json({ success: true });
};

export default handler;
