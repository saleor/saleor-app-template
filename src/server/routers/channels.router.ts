import { router } from "../server";
import { FetchChannelsDocument } from "../../../generated/graphql";
import { createClient } from "../../lib/graphql";
import { procedureWithGraphqlClient } from "../procedure/procedure-with-graphql-client";

export const channelsRouter = router({
  fetch: procedureWithGraphqlClient.query(async ({ ctx, input }) => {
    const client = createClient(`https://${ctx.domain}/graphql/`, async () =>
      Promise.resolve({ token: ctx.appToken })
    );

    const data = await client.query(FetchChannelsDocument, {}).toPromise();

    return data;
  }),
});
