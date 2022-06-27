import { NextPage } from "next";
import { NextComponentType, NextPageContext } from "next/types";
import { ReactNode } from "react";

export type PageWithLayout<P = {}> = NextPage<P> & {
  getLayout?: (page: ReactNode) => ReactNode;
};

export type AppProps = {
  pageProps: any;
  Component: NextComponentType<NextPageContext, any, {}> & { layoutProps: any };
};

export type AppLayoutProps<P = {}> = AppProps & {
  Component: PageWithLayout<P>;
};
