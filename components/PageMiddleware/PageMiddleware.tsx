import { useMemo } from "react";
import useApp from "../../hooks/useApp";
import { AppLayoutProps, AppProps } from "../../types";
import jwt from "jsonwebtoken";
import { isInIframe } from "../../utils/misc";
import { DashboardTokenPayload } from "../../lib/middlewares";
import AccessWarning from "../AccessWarning/AccessWarning";

const PageMiddleware = ({ Component, pageProps }: AppLayoutProps) => {
  const app = useApp()?.getState();

  const tokenClaims = useMemo(() => {
    try {
      return jwt.decode(app?.token as string);
    } catch (e) {
      console.error(e);
      return null;
    }
  }, [app]);

  const iframeCheck = useMemo(() => isInIframe(), []);

  const isTokenValid =
    tokenClaims && (tokenClaims as DashboardTokenPayload).iss === app?.domain;

  if (iframeCheck) {
    if (app?.token) {
      if (isTokenValid) {
        return <Component {...pageProps} />;
      }

      return <AccessWarning />;
    }
  }

  return <AccessWarning />;
};

export default PageMiddleware;
