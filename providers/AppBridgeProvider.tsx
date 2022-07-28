import { App, createApp } from "@saleor/app-bridge";
import { createContext, PropsWithChildren, useMemo } from "react";

interface IAppContext {
  app?: App;
}

export const AppContext = createContext<IAppContext>({ app: undefined });

function AppBridgeProvider(props: PropsWithChildren<{}>) {
  const value = useMemo(() => {
    if (typeof window !== "undefined") {
      return { app: createApp() };
    }
    return { app: undefined };
  }, []);

  return <AppContext.Provider value={value} {...props} />;
}

export default AppBridgeProvider;
