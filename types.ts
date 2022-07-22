import { NextPage } from "next";
import { NextComponentType, NextPageContext } from "next/types";
import { ReactElement, ReactNode } from "react";

export type PageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

export type AppProps = {
  pageProps: any;
  Component: NextComponentType<NextPageContext, any, {}> & { layoutProps: any };
};

export type AppLayoutProps = AppProps & {
  Component: PageWithLayout;
};
