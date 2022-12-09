import { fetchProductsRouter } from "./fetch-products/fetch-products.router";
import { router } from "../server";

export const appRouter = router({
  products: fetchProductsRouter,
});

export type AppRouter = typeof appRouter;
