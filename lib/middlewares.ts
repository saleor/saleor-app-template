import { NextApiRequest } from "next";
import jwt, { JwtPayload } from "jsonwebtoken";
import jwks , { CertSigningKey, RsaSigningKey } from "jwks-rsa";

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
  return saleorDomain;
};

export const eventMiddleware = (
  request: NextApiRequest,
  expectedEvent: string
) => {
  const receivedEvent =
    request.headers[Constants.SALEOR_EVENT_HEADER]?.toString();
  if (receivedEvent !== expectedEvent) {
    throw new MiddlewareError("Invalid event.", 400);
  }
};

export const webhookMiddleware = (
  request: NextApiRequest,
  expectedEvent: string
) => {
  domainMiddleware(request);
  eventMiddleware(request, expectedEvent);
};

export const jwtVerifyMiddleware = async (request: NextApiRequest) => {
  const {
    [Constants.SALEOR_DOMAIN_HEADER]: domain,
    "authorization-bearer": token
  } = request.headers;

  let tokenClaims;
  try {
    tokenClaims = jwt.decode(token as string);
  } catch (e) {
    console.error(e);
    throw new MiddlewareError("Invalid token.", 400);
  }

  if (tokenClaims === null) {
    throw new MiddlewareError("Missing token.", 400);
  }
  if ((tokenClaims as JwtPayload).iss !== domain) {
    throw new MiddlewareError("Invalid token.", 400);
  }

  const jwksClient = jwks({ jwksUri: `https://${domain}/.well-known/jwks.json` });
  const signingKey = await jwksClient.getSigningKey();
  const signingSecret =
    (signingKey as CertSigningKey).publicKey ||
    (signingKey as RsaSigningKey).rsaPublicKey;

  try {
    jwt.verify(token as string, signingSecret);
  } catch (e) {
    console.error(e);
    throw new MiddlewareError("Invalid token.", 400);
  }
};
