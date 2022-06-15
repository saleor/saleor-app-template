import jwt, { JwtPayload } from "jsonwebtoken";
import jwks, { CertSigningKey, RsaSigningKey } from "jwks-rsa";
import type { Middleware } from "retes";
import { compose } from "retes/util";
import { Response } from "retes/response";
import { SALEOR_DOMAIN_HEADER } from "@saleor/app-sdk/const";
import { withSaleorDomainPresent } from "@saleor/app-sdk/middleware";

import { createClient } from "./graphql";
import { getEnvVars } from "./environment";
import {
  FetchAppDetailsDocument,
  FetchAppDetailsQuery,
} from "../generated/graphql";

interface DashboardTokenPayload extends JwtPayload {
  app: string;
}

export const withSaleorDomainMatch: Middleware = (handler) =>
  withSaleorDomainPresent(async (request) => {
    const { SALEOR_DOMAIN } = await getEnvVars();

    if (SALEOR_DOMAIN === undefined) {
      return Response.InternalServerError({
        success: false,
        message: "Missing Saleor domain environment variable.",
      });
    }

    if (SALEOR_DOMAIN !== request.headers[SALEOR_DOMAIN_HEADER]) {
      return Response.BadRequest({
        success: false,
        message: "Invalid Saleor domain header.",
      });
    }

    return handler(request);
  });

export const withJWTVerified: Middleware = (handler) => async (request) => {
  const {
    [SALEOR_DOMAIN_HEADER]: saleorDomain,
    "authorization-bearer": token,
  } = request.headers;

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
      message: "Missing token.",
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
  const appId = (
    await client
      .query<FetchAppDetailsQuery>(FetchAppDetailsDocument)
      .toPromise()
  ).data?.app?.id;

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
    (signingKey as CertSigningKey).publicKey ||
    (signingKey as RsaSigningKey).rsaPublicKey;

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
