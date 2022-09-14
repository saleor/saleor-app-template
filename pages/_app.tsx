import "../styles/globals.css";

import { Theme } from "@material-ui/core/styles";
import { AppBridge, AppBridgeProvider } from "@saleor/app-sdk/app-bridge";
import { ThemeProvider as MacawUIThemeProvider } from "@saleor/macaw-ui";
import React, { PropsWithChildren, useEffect } from "react";

import AuthorizedPage from "../components/AuthorizedPage/AuthorizedPage";
import GraphQLProvider from "../providers/GraphQLProvider";
import { AppLayoutProps } from "../types";

const themeOverrides: Partial<Theme> = {
  overrides: {
    MuiTableCell: {
      body: {
        paddingBottom: 8,
        paddingTop: 8,
      },
      root: {
        height: 56,
        paddingBottom: 4,
        paddingTop: 4,
      },
    },
  },
};

/**
 * Ensure instance is a singleton.
 * TODO: This is React 18 issue, consider hiding this workaround inside app-sdk
 */
const appBridgeInstance = typeof window !== "undefined" ? new AppBridge() : undefined;

// That's a hack required by Macaw-UI incompatibility with React@18
const ThemeProvider = MacawUIThemeProvider as React.FC<
  PropsWithChildren<{ overrides: Partial<Theme>; ssr: boolean }>
>;

function SaleorApp({ Component, pageProps }: AppLayoutProps) {
  const getLayout = Component.getLayout ?? ((page) => page);

  useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles?.parentElement?.removeChild(jssStyles);
    }
  }, []);

  return (
    <AppBridgeProvider appBridgeInstance={appBridgeInstance}>
      <GraphQLProvider>
        <ThemeProvider overrides={themeOverrides} ssr>
          <AuthorizedPage>{getLayout(<Component {...pageProps} />)}</AuthorizedPage>
        </ThemeProvider>
      </GraphQLProvider>
    </AppBridgeProvider>
  );
}

export default SaleorApp;
