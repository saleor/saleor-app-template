import { z } from "zod";
import { procedure, router } from "../../server";
import { saleorApp } from "../../../../saleor-app";
import { FetchProductsDocument } from "../../../../generated/graphql";
import { TRPCError } from "@trpc/server";
import { createClient } from "../../../lib/graphql";

export const fetchProductsRouter = router({
  fetch: procedure
    .input(
      z.object({
        count: z.number().min(1),
      })
    )
    .query(async ({ ctx, input }) => {
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

      console.log(authData.token);

      const client = createClient(`https://${ctx.domain}/graphql/`, async () =>
        Promise.resolve({ token: authData.token })
      );

      const data = await client
        .query(FetchProductsDocument, {
          count: input.count,
        })
        .toPromise();

      return data;
    }),
});
