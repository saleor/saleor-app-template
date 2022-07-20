import { NextPage } from "next";
import { AppProps } from "next/app";
import { ReactNode } from "react";

export type PageWithLayout<P = {}> = NextPage<P> & {
  getLayout?: (page: ReactNode) => ReactNode;
};

export type AppLayoutProps<P = {}> = AppProps & {
  Component: PageWithLayout<P>;
};
