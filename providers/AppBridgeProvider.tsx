/**
 * TODO Fix import in app-sdk, why it points to /dist/?
 */
import { AppBridge } from "@saleor/app-sdk/dist/app-bridge";
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
