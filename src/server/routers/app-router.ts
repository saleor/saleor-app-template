import { productsRouter } from "./products.router";
import { router } from "../server";
import { channelsRouter } from "./channels.router";

export const appRouter = router({
  products: productsRouter,
  channels: channelsRouter,
});

export type AppRouter = typeof appRouter;
