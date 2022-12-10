import { MiddlewareFunction, TRPCError } from "@trpc/server";
import { middleware } from "../server";
import { saleorApp } from "../../../saleor-app";

/**
 * Perform APL token retrieval in middleware, required by every handler that connects to Saleor
 */
export const attachAppToken = middleware(async ({ ctx, next }) => {
  if (!ctx.domain) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Missing domain in request",
    });
  }

  const authData = await saleorApp.apl.get(ctx.domain);

  if (!authData?.token) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Missing auth data",
    });
  }

  return next({
    ctx: {
      appToken: authData.token,
    },
  });
});
