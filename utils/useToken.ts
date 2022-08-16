import * as jose from "jose";
import { useMemo } from "react";

import useApp from "../hooks/useApp";

interface DashboardTokenPayload extends jose.JWTPayload {
  app: string;
}
interface TokenProps {
  isTokenValid: boolean;
  hasAppToken: boolean;
  tokenClaims: DashboardTokenPayload | null;
}

const useToken = (): TokenProps => {
  const app = useApp()?.getState();

  const tokenClaims = useMemo(() => {
    try {
      if (app?.token) {
        return jose.decodeJwt(app?.token) as DashboardTokenPayload;
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  }, [app?.token]);

  const isTokenValid = tokenClaims ? tokenClaims.iss === app?.domain : false;

  return {
    isTokenValid,
    tokenClaims,
    hasAppToken: !!app?.token,
  };
};

export default useToken;
