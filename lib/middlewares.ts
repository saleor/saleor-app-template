import crypto from "crypto";
import jwt, { JwtPayload } from "jsonwebtoken";
import jwks, { CertSigningKey, RsaSigningKey } from "jwks-rsa";
import type { Middleware } from "retes";
import { Response } from "retes/response";
import { SALEOR_DOMAIN_HEADER } from "@saleor/app-sdk/const";
import { withSaleorDomainPresent } from "@saleor/app-sdk/middleware";
import * as jose from "jose";

import { createClient } from "./graphql";
import { getEnvVars } from "./environment";
import { FetchAppDetailsDocument } from "../generated/graphql";

interface DashboardTokenPayload extends JwtPayload {
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
  const {
    [SALEOR_DOMAIN_HEADER]: saleorDomain,
    "authorization-bearer": token,
  } = request.headers;

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

export const withWebhookSignatureVerified = (
  secretKey: string | undefined = undefined
): Middleware => {
  return (handler) => async (request) => {
    const {
      [SALEOR_DOMAIN_HEADER]: saleorDomain,
      "saleor-signature": payloadSignature,
    } = request.headers;

    if (secretKey !== undefined) {
      const calculatedSignature = crypto
        .createHmac("sha256", secretKey)
        .update(request.rawBody)
        .digest("hex");

      if (calculatedSignature !== payloadSignature) {
        return Response.BadRequest({
          success: false,
          message: "Invalid signature.",
        });
      }
    } else {
      const jwksClient = jose.createRemoteJWKSet(
        new URL(`https://${saleorDomain}/.well-known/jwks.json`)
      );
      const [header, _, signature] = payloadSignature.split(".");
      const jws = {
        protected: header,
        payload: request.rawBody,
        signature,
      };

      try {
        await jose.flattenedVerify(jws, jwksClient);
      } catch {
        return Response.BadRequest({
          success: false,
          message: "Invalid signature.",
        });
      }
    }

    return handler(request);
  };
};
