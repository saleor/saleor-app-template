import { procedure, router } from "../server";
import { saleorApp } from "../../../saleor-app";
import { FetchChannelsDocument } from "../../../generated/graphql";
import { TRPCError } from "@trpc/server";
import { createClient } from "../../lib/graphql";

export const channelsRouter = router({
  fetch: procedure.query(async ({ ctx, input }) => {
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

    const client = createClient(`https://${ctx.domain}/graphql/`, async () =>
      Promise.resolve({ token: authData.token })
    );

    const data = await client.query(FetchChannelsDocument, {}).toPromise();

    return data;
  }),
});
