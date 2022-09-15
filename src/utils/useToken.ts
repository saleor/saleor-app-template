import { useAppBridge } from "@saleor/app-sdk/app-bridge";
import * as jose from "jose";
import { useMemo } from "react";

interface DashboardTokenPayload extends jose.JWTPayload {
  app: string;
}
interface TokenProps {
  isTokenValid: boolean;
  hasAppToken: boolean;
  tokenClaims: DashboardTokenPayload | null;
}

/**
 * TODO: Move to sdk
 */
const useToken = (): TokenProps => {
  const { appBridgeState } = useAppBridge();

  const tokenClaims = useMemo(() => {
    try {
      if (appBridgeState?.token) {
        return jose.decodeJwt(appBridgeState?.token) as DashboardTokenPayload;
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  }, [appBridgeState?.token]);

  const isTokenValid = tokenClaims ? tokenClaims.iss === appBridgeState?.domain : false;

  return {
    isTokenValid,
    tokenClaims,
    hasAppToken: !!appBridgeState?.token,
  };
};

export default useToken;
