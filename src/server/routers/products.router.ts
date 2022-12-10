import { z } from "zod";
import { router } from "../server";
import { FetchProductsDocument } from "../../../generated/graphql";
import { createClient } from "../../lib/graphql";
import { procedureWithGraphqlClient } from "../procedure/procedure-with-graphql-client";

export const productsRouter = router({
  fetch: procedureWithGraphqlClient
    .input(
      z.object({
        count: z.number().min(1),
        channel: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const client = createClient(`https://${ctx.domain}/graphql/`, async () =>
        Promise.resolve({ token: ctx.appToken })
      );

      const data = await client
        .query(FetchProductsDocument, {
          count: input.count,
          channel: input.channel,
        })
        .toPromise();

      return data;
    }),
});
