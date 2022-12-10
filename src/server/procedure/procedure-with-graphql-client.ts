import { MiddlewareFunction, TRPCError } from "@trpc/server";
import { middleware, procedure } from "../server";
import { saleorApp } from "../../../saleor-app";
import { createClient } from "../../lib/graphql";
import { attachAppToken } from "../middleware/attach-app-token";

/**
 * Construct common graphQL client and attach it to the context
 */
export const procedureWithGraphqlClient = procedure
  .use(attachAppToken)
  .use(async ({ ctx, next }) => {
    const client = createClient(`https://${ctx.domain}/graphql/`, async () =>
      Promise.resolve({ token: ctx.appToken })
    );

    return next({
      ctx: {
        apiClient: client,
      },
    });
  });
