import { httpBatchLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import { AppRouter } from "./server/routers/app-router";
import { SALEOR_AUTHORIZATION_BEARER_HEADER, SALEOR_DOMAIN_HEADER } from "@saleor/app-sdk/const";
import { appBridgeInstance } from "./pages/_app";


function getBaseUrl() {
  if (typeof window !== "undefined") return "";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;

  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const trpcClient = createTRPCNext<AppRouter>({
  config({ ctx }) {
    return {
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          headers() {
            return {
              /**
               * Attach headers from app to client requests, so tRPC can add them to context
               */
              [SALEOR_DOMAIN_HEADER]: appBridgeInstance?.getState().domain,
              [SALEOR_AUTHORIZATION_BEARER_HEADER]: appBridgeInstance?.getState().token
            }
          }
        }),

      ],
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },
  ssr: true,
});
