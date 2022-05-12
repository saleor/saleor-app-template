import { NextApiRequest } from "next";
import * as Constants from "../constants";
import MiddlewareError from "../utils/MiddlewareError";

export const getBaseURL = (req: NextApiRequest): string => {
  const { host, "x-forwarded-proto": protocol = "http" } = req.headers;
  return `${protocol}://${host}`;
};

export const domainMiddleware = (request: NextApiRequest) => {
  const saleorDomain = request.headers[Constants.SALEOR_DOMAIN_HEADER];
  if (!saleorDomain) {
    throw new MiddlewareError("Missing saleor domain token.", 400);
  }
};

export const eventMiddleware = (
  request: NextApiRequest,
  expectedEvent: string
) => {
  const receivedEvent = request.headers[Constants.SALEOR_EVENT]?.toString();
  if (receivedEvent !== expectedEvent) {
    throw new MiddlewareError("Invalid event", 400);
  }
};

export const webhookMiddleware = (
  request: NextApiRequest,
  expectedEvent: string
) => {
  domainMiddleware(request);
  eventMiddleware(request, expectedEvent);
};
