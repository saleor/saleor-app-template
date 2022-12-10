import { AppBridge, useAppBridge } from "@saleor/app-sdk/app-bridge";
import { SALEOR_AUTHORIZATION_BEARER_HEADER, SALEOR_DOMAIN_HEADER } from "@saleor/app-sdk/const";

type HasAppBridgeState = Pick<AppBridge, "getState">;

/**
 * Browser only (appBridge is initialized in the browser)
 * This is fetch client decorated with Saleor headers required by API functions
 */
export const createAuthenticatedFetch =
  (appBridge: HasAppBridgeState, fetch = global.fetch): typeof global.fetch =>
  (input, init) => {
    const { token, domain } = appBridge.getState();

    const headers = new Headers(init?.headers);
    headers.set(SALEOR_DOMAIN_HEADER, domain);
    headers.set(SALEOR_AUTHORIZATION_BEARER_HEADER, token ?? "");

    const clonedInit: RequestInit = {
      ...(init ?? {}),
      headers,
    };

    return fetch(input, clonedInit);
  };
/**
 * Browser only
 */
export const useAuthenticatedFetch = (fetch = global.fetch) => {
  const { appBridge } = useAppBridge();

  if (!appBridge) {
    throw new Error("useAuthenticatedFetch can be used only in browser context");
  }

  return createAuthenticatedFetch(appBridge, fetch);
};
