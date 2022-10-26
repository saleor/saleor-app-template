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
      <h1>Welcome to Saleor App Template (Next.js) 🚀</h1>
      <p>This is a boilerplate you can start with, to create an app connected to Saleor</p>
      <h2>Resources</h2>
      <ul>
        <li>
          <a
            onClick={handleLinkClick}
            target="_blank"
            rel="noreferrer"
            href="https://github.com/saleor/app-examples"
          >
            App Examples repository
          </a>
        </li>
        <li>
          <a target="_blank" rel="noreferrer" href="https://github.com/saleor/saleor-app-sdk">
            Saleor App SDK
          </a>
        </li>
        <li>
          <a
            onClick={handleLinkClick}
            target="_blank"
            href="https://docs.saleor.io/docs/3.x/developer/extending/apps/key-concepts"
            rel="noreferrer"
          >
            Apps documentation
          </a>
        </li>
        <li>
          <a
            onClick={handleLinkClick}
            target="_blank"
            href="https://github.com/saleor/saleor-cli"
            rel="noreferrer"
          >
            Saleor CLI
          </a>
        </li>
      </ul>

      {appBridgeState?.ready && mounted ? (
        <ClientContent />
      ) : (
        <p>Install this app in your Dashboard and check extra powers!</p>
      )}
    </div>
  );
};

export default IndexPage;
