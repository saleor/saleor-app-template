import { useContext } from "react";

import { AppContext } from "../providers/AppBridgeProvider";

const useApp = () => {
  const { app } = useContext(AppContext);
  return app;
};

export default useApp;
