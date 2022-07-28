import jwt from "jsonwebtoken";
import { useMemo } from "react";

import useApp from "../hooks/useApp";
import { DashboardTokenPayload } from "../lib/middlewares";

interface TokenProps {
  isTokenValid: boolean;
  hasAppToken: boolean;
  tokenClaims: DashboardTokenPayload | null;
}

const useToken = (): TokenProps => {
  const app = useApp()?.getState();

  const tokenClaims = useMemo(() => {
    try {
      return jwt.decode(app?.token as string) as DashboardTokenPayload;
    } catch (e) {
      console.error(e);
      return null;
    }
  }, [app]);

  const isTokenValid = tokenClaims ? tokenClaims.iss === app?.domain : false;

  return {
    isTokenValid,
    tokenClaims,
    hasAppToken: !!app?.token,
  };
};

export default useToken;
