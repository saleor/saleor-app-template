import { ReactNode, useEffect, useMemo, useState } from "react";
import useApp from "../../hooks/useApp";
import jwt from "jsonwebtoken";
import { isInIframe } from "../../utils/misc";
import { DashboardTokenPayload } from "../../lib/middlewares";
import AccessWarning from "../AccessWarning/AccessWarning";
import LoadingPage from "../LoadingPage/LoadingPage";

type AuthorizedPageProps = {
  children: ReactNode;
};

const AuthorizedPage = ({ children }: AuthorizedPageProps) => {
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

  const isIframe = useMemo(() => isInIframe(), []);
  const isTokenValid =
    tokenClaims && (tokenClaims as DashboardTokenPayload).iss === app?.domain;

  if (!mounted) {
    return <LoadingPage />;
  }

  if (!isIframe) {
    console.error("The view can only be displayed in the iframe.");
    return <AccessWarning />;
  }

  if (!app?.token) {
    console.error("App token missing.");
    return <AccessWarning />;
  }

  if (!isTokenValid) {
    console.error("App token is invalid.");
    return <AccessWarning />;
  }

  return <>{children}</>;
};

export default AuthorizedPage;
