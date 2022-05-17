import { App, createApp } from "@saleor/app-bridge";
import { createContext, useMemo, PropsWithChildren } from "react";

interface IAppContext {
  app?: App;
}

export const AppContext = createContext<IAppContext>({ app: undefined });

const AppBridgeProvider: React.FC<PropsWithChildren<{}>> = (props) => {
  const app = useMemo(() => {
    if (typeof window !== "undefined") {
      return createApp();
    }
  }, []);

  return <AppContext.Provider value={{ app }} {...props} />;
};

export default AppBridgeProvider;
