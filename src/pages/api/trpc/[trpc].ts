import * as trpcNext from "@trpc/server/adapters/next";
import { appRouter } from "../../../server/routers/app-router";
import { SALEOR_DOMAIN_HEADER, SALEOR_AUTHORIZATION_BEARER_HEADER } from "@saleor/app-sdk/const";
import { inferAsyncReturnType } from "@trpc/server";

/**
 * Attach headers from request to tRPC context to expose them to resolvers
 */
const createContext = async ({ res, req }: trpcNext.CreateNextContextOptions) => {
  return {
    domain: req.headers[SALEOR_DOMAIN_HEADER] as string | undefined,
    token: req.headers[SALEOR_AUTHORIZATION_BEARER_HEADER] as string | undefined,
  };
};

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
});

export type Context = inferAsyncReturnType<typeof createContext>;
