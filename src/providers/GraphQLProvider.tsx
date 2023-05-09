import { useAppBridge } from "@saleor/app-sdk/app-bridge";
import { PropsWithChildren } from "react";
import { Provider } from "urql";
import { createClient } from "../lib/create-graphq-client";

export function GraphQLProvider(props: PropsWithChildren<{}>) {
  const { appBridgeState } = useAppBridge();
  const url = appBridgeState?.saleorApiUrl!;

  if(!url) {
    return <div>{props.children}</div>
  }

  const client = createClient(url, async () => Promise.resolve({ token: appBridgeState?.token! }));

  return <Provider value={client} {...props} />;
}
