import { NextPage } from "next";
import { useAppBridge } from "@saleor/app-sdk/app-bridge";
import { Button } from "@saleor/macaw-ui";
import dynamic from "next/dynamic";
import { MouseEventHandler, useEffect, useState } from "react";

const ClientContent = dynamic(() => import("../DashboardActions"), {
  ssr: false,
});

/**
 * This is page publicly accessible from your app.
 * You should probably remove it.
 */
const IndexPage: NextPage = () => {
  const { appBridgeState, appBridge } = useAppBridge();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLinkClick: MouseEventHandler<HTMLAnchorElement> = (e) => {
    /**
     * In iframe, link can't be opened in new tab, so Dashboard must be a proxy
     */
    if (appBridgeState?.ready) {
      e.preventDefault();

      appBridge?.dispatch({
        type: "redirect",
        payload: {
          newContext: true,
          actionId: "redirect-to-external-resource",
          to: e.currentTarget.href,
        },
      });
    }

    /**
     * Otherwise, assume app is accessed outside of Dashboard, so href attribute on <a> will work
     */
  };

  return (
    <div>
      <h1>JSON Configuration example 🚀</h1>
      <p>Define conf schema as JSON in the /lib/confSchema.ts file</p>

      {appBridgeState?.ready && mounted ? (
        <ClientContent />
      ) : (
        <p>Install this app in your Dashboard and check extra powers!</p>
      )}
    </div>
  );
};

export default IndexPage;
