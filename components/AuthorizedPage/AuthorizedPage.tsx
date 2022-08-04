import { ReactNode } from "react";

import { isInIframe } from "../../utils/misc";
import useIsMounted from "../../utils/useIsMounted";
import useToken from "../../utils/useToken";
import AccessWarning from "../AccessWarning/AccessWarning";
import LoadingPage from "../LoadingPage/LoadingPage";

type AuthorizedPageProps = {
  children: ReactNode;
};

function AuthorizedPage({ children }: AuthorizedPageProps) {
  // Next and React 18 have issues with hydration
  // GH Issue: https://github.com/vercel/next.js/discussions/35773
  // To be fixed once a proper solution is available
  const mounted = useIsMounted();
  const { isTokenValid, hasAppToken } = useToken();

  if (!mounted) {
    return <LoadingPage />;
  }

  if (!isInIframe()) {
    console.error("The view can only be displayed in the iframe.");
    return <AccessWarning cause="not_in_iframe" />;
  }

  if (!hasAppToken) {
    console.error("App token missing.");
    return <AccessWarning cause="missing_access_token" />;
  }

  if (!isTokenValid) {
    console.error("App token is invalid.");
    return <AccessWarning cause="invalid_access_token" />;
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
}

export default AuthorizedPage;
