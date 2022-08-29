import { App, createApp } from "@saleor/app-bridge";
import { createContext, PropsWithChildren } from "react";

interface IAppContext {
  app?: App;
}

export const AppContext = createContext<IAppContext>({ app: undefined });

let saleorAppBridgeInstance: IAppContext = { app: undefined };

if (typeof window !== "undefined") {
  saleorAppBridgeInstance = {
    app: createApp(),
  };
}

function AppBridgeProvider(props: PropsWithChildren<{}>) {
  return <AppContext.Provider value={saleorAppBridgeInstance} {...props} />;
}

export default AppBridgeProvider;
