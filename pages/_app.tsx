import type { AppProps } from "next/app";

import "../styles/globals.css";
import AppBridgeProvider from "../providers/AppBridgeProvider";
import GraphQLProvider from "../providers/GraphQLProvider";

const SaleorApp = ({ Component, pageProps }: AppProps) => {
  return (
    <AppBridgeProvider>
      <GraphQLProvider>
        <Component {...pageProps} />
      </GraphQLProvider>
    </AppBridgeProvider>
  );
};

export default SaleorApp;
