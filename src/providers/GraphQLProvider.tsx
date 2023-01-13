import { useAppBridge } from "@saleor/app-sdk/app-bridge";
import { PropsWithChildren } from "react";
import { Provider } from "urql";

import { createClient } from "../lib/create-graphq-client";

/**
 * This provider allows frontend to call graphQL query using user token (of the logged dashboard user).
 */
function GraphQLProvider(props: PropsWithChildren<{}>) {
  const { appBridgeState } = useAppBridge();

  /**
   * If saleorApiUrl is not defined, it means app is not mounted in Dashboard
   * or Dashboard hasn't successfully hand-shaken with the App.
   *
   * In this scenario, graphQL client is redundant
   */
  if (!appBridgeState?.saleorApiUrl) {
    return <div {...props} />;
  }

  const client = createClient(appBridgeState.saleorApiUrl, async () =>
    Promise.resolve({ token: appBridgeState?.token! })
  );

  return <Provider value={client} {...props} />;
}

export default GraphQLProvider;
