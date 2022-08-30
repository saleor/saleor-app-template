import { AppBridge } from "@saleor/app-sdk/app-bridge";
import { createContext, PropsWithChildren } from "react";

interface IAppContext {
  app?: AppBridge;
}

export const AppContext = createContext<IAppContext>({ app: undefined });

let saleorAppBridgeInstance: IAppContext = { app: undefined };

if (typeof window !== "undefined") {
  saleorAppBridgeInstance = {
    app: new AppBridge(),
  };
}

function AppBridgeProvider(props: PropsWithChildren<{}>) {
  return <AppContext.Provider value={saleorAppBridgeInstance} {...props} />;
}

export default AppBridgeProvider;
