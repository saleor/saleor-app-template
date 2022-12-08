import { z } from "zod";
import { procedure, router } from "../../server";

export const fetchProductsRouter = router({
  fetch: procedure
    .input(
      z.object({
        count: z.number().min(1),
      })
    )
    .query((res) => {
      // query

      console.log(res)

      return {
        foo: 'bar'
      };
    }),
});
