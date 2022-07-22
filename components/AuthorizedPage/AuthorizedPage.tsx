import { PropsWithChildren, useEffect, useMemo, useState } from "react";
import useApp from "../../hooks/useApp";
import jwt from "jsonwebtoken";
import { isInIframe } from "../../utils/misc";
import { DashboardTokenPayload } from "../../lib/middlewares";
import AccessWarning from "../AccessWarning/AccessWarning";

const AuthorizedPage: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const app = useApp()?.getState();

  // Next and React 18 have issues with hydatation
  // GH Issue: https://github.com/vercel/next.js/discussions/35773
  // To be fixed once a proper solution is available
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

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

  if (!mounted) {
    return null;
  }

  if (iframeCheck) {
    if (app?.token) {
      if (isTokenValid) {
        return <>{children}</>;
      }

      return <AccessWarning />;
    }
  }

  return <AccessWarning />;
};

export default AuthorizedPage;
