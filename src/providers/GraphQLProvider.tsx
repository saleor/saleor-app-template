import { useAppBridge } from "@saleor/app-sdk/app-bridge";
import { PropsWithChildren } from "react";
import { Provider } from "urql";
import { createGraphQLClient } from "../lib/create-graphql-client";

export function GraphQLProvider(props: PropsWithChildren<{}>) {
  const { appBridgeState } = useAppBridge();
  const {saleorApiUrl, token } = appBridgeState || {};

  if (!saleorApiUrl) {
    console.warn("Install the app in the Dashboard to be able to query Saleor API.");
    return <div>{props.children}</div>;
  }

  const client = createGraphQLClient({saleorApiUrl, token});

  return <Provider value={client} {...props} />;
}
