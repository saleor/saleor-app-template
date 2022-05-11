import { NextApiRequest, NextApiResponse } from "next";
import * as Constants from "../constants";

export const getBaseURL = (req: NextApiRequest): string => {
  const { host, "x-forwarded-proto": protocol = "http" } = req.headers;
  return `${protocol}://${host}`;
};

export const domainMiddleware = (
  request: NextApiRequest,
  response: NextApiResponse
) => {
  const saleorDomain = request.headers[Constants.SALEOR_DOMAIN_HEADER];
  if (!saleorDomain) {
    response
      .status(400)
      .json({ success: false, message: "Missing saleor domain token." });
    return;
  }
};

export const eventMiddleware = (
  request: NextApiRequest,
  response: NextApiResponse,
  expectedEvent: string
) => {
  const receivedEvent = request.headers[Constants.SALEOR_EVENT]?.toString();
  if (receivedEvent !== expectedEvent) {
    response.status(400).json({ success: false, message: "Invalid event" });
    return;
  }
};

export const webhookMiddleware = (
  request: NextApiRequest,
  response: NextApiResponse,
  expectedEvent: string
) => {
  domainMiddleware(request, response);
  eventMiddleware(request, response, expectedEvent);
};
