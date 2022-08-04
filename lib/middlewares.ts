import { SALEOR_DOMAIN_HEADER } from "@saleor/app-sdk/const";
import { withSaleorDomainPresent } from "@saleor/app-sdk/middleware";
import jwt, { JwtPayload } from "jsonwebtoken";
import jwks, { CertSigningKey, RsaSigningKey } from "jwks-rsa";
import type { Middleware } from "retes";
import { Response } from "retes/response";

import { FetchAppDetailsDocument } from "../generated/graphql";
import { getEnvVars } from "./environment";
import { createClient } from "./graphql";

export interface DashboardTokenPayload extends JwtPayload {
  app: string;
}

export const withSaleorDomainMatch: Middleware = (handler) =>
  withSaleorDomainPresent(async (request) => {
    const { SALEOR_DOMAIN } = await getEnvVars();

    if (SALEOR_DOMAIN === undefined) {
      return Response.InternalServerError({
        success: false,
        message: "Missing SALEOR_DOMAIN environment variable.",
      });
    }

    if (SALEOR_DOMAIN !== request.headers[SALEOR_DOMAIN_HEADER]) {
      return Response.BadRequest({
        success: false,
        message: `Invalid ${SALEOR_DOMAIN_HEADER} header.`,
      });
    }

    return handler(request);
  });

export const withJWTVerified: Middleware = (handler) => async (request) => {
  const { [SALEOR_DOMAIN_HEADER]: saleorDomain, "authorization-bearer": token } = request.headers;

  if (token === undefined) {
    return Response.BadRequest({
      success: false,
      message: "Missing token.",
    });
  }

  let tokenClaims;
  try {
    tokenClaims = jwt.decode(token as string);
  } catch (e) {
    console.error(e);
    return Response.BadRequest({
      success: false,
      message: "Invalid token.",
    });
  }

  if (tokenClaims === null) {
    return Response.BadRequest({
      success: false,
      message: "Invalid token.",
    });
  }
  if ((tokenClaims as DashboardTokenPayload).iss !== saleorDomain) {
    return Response.BadRequest({
      success: false,
      message: "Invalid token.",
    });
  }

  const client = createClient(`https://${saleorDomain}/graphql/`, async () =>
    Promise.resolve({ token: (await getEnvVars()).SALEOR_AUTH_TOKEN })
  );

  const appDetails = await client.query(FetchAppDetailsDocument).toPromise();

  const appId = appDetails?.data?.app?.id;

  if ((tokenClaims as DashboardTokenPayload).app !== appId) {
    return Response.BadRequest({
      success: false,
      message: "Invalid token.",
    });
  }

  const jwksClient = jwks({
    jwksUri: `https://${saleorDomain}/.well-known/jwks.json`,
  });
  const signingKey = await jwksClient.getSigningKey();
  const signingSecret =
    (signingKey as CertSigningKey).publicKey || (signingKey as RsaSigningKey).rsaPublicKey;

  try {
    jwt.verify(token as string, signingSecret);
  } catch (e) {
    console.error(e);
    return Response.BadRequest({
      success: false,
      message: "Invalid token.",
    });
  }

  return handler(request);
};
