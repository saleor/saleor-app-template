import { useAppBridge } from "@saleor/app-sdk/app-bridge";
import { PropsWithChildren } from "react";
import { Provider } from "urql";

import { createGraphQlClient } from "../lib/create-graphql-client";

/**
 * Saleor uses graphQL api, so app-sdk is shipped with an urql client.
 * It can be replaced with e.g. apollo
 */
function GraphQLProvider(props: PropsWithChildren<{}>) {
  const { appBridgeState } = useAppBridge();
  const domain = appBridgeState?.domain!;

  const client = createGraphQlClient(`https://${domain}/graphql/`, async () =>
    Promise.resolve({ token: appBridgeState?.token! })
  );

  return <Provider value={client} {...props} />;
}

export default GraphQLProvider;
