import React, { useEffect, PropsWithChildren } from "react";
import type { AppProps } from "next/app";
import { ThemeProvider as MacawUIThemeProvider } from "@saleor/macaw-ui";

import "../styles/globals.css";
import AppBridgeProvider from "../providers/AppBridgeProvider";
import GraphQLProvider from "../providers/GraphQLProvider";

// That's a hack required by Macaw-UI incompitability with React@18
const ThemeProvider = MacawUIThemeProvider as React.FC<PropsWithChildren<{}>>;

const SaleorApp = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles?.parentElement?.removeChild(jssStyles);
    }
  }, []);

  return (
    <AppBridgeProvider>
      <GraphQLProvider>
        <ThemeProvider>
          <Component {...pageProps} />
        </ThemeProvider>
      </GraphQLProvider>
    </AppBridgeProvider>
  );
};

export default SaleorApp;
