import { z } from "zod";

export const appConfigInputSchema = z.object({
  shopConfigPerChannel: z.record(
    z.object({
      appConfiguration: z.object({
        /**
         * min() to allow empty strings
         */
        exampleSecretKey: z.string().min(0),
        examplePublicKey: z.string().min(0),
      }),
    })
  ),
});
