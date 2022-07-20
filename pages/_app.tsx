import React, { useEffect, PropsWithChildren, ReactNode } from "react";
import { ThemeProvider as MacawUIThemeProvider } from "@saleor/macaw-ui";
import { Theme } from "@material-ui/core/styles";

import "../styles/globals.css";
import AppBridgeProvider from "../providers/AppBridgeProvider";
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

// That's a hack required by Macaw-UI incompitability with React@18
const ThemeProvider = MacawUIThemeProvider as React.FC<
  PropsWithChildren<{ overrides: Partial<Theme> }>
>;

const SaleorApp = ({ Component, pageProps }: AppLayoutProps) => {
  const getLayout = Component.getLayout || ((page: ReactNode) => page);

  useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles?.parentElement?.removeChild(jssStyles);
    }
  }, []);

  return (
    <AppBridgeProvider>
      <GraphQLProvider>
        <ThemeProvider overrides={themeOverrides}>
          {getLayout(<Component {...pageProps} />)}
        </ThemeProvider>
      </GraphQLProvider>
    </AppBridgeProvider>
  );
};

export default SaleorApp;
