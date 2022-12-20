import { NextPage } from "next";
import { useAppBridge } from "@saleor/app-sdk/app-bridge";
import { Button } from "@saleor/macaw-ui";
import dynamic from "next/dynamic";
import { MouseEventHandler, useEffect, useState } from "react";
import { Link, TextField } from "@material-ui/core";

const ClientContent = dynamic(() => import("../DashboardActions"), {
  ssr: false,
});

const AddToSaleorForm = () => (
  <form
    style={{
      display: "flex",
      gap: "2rem",
    }}
    onSubmit={(event) => {
      event.preventDefault();

      const saleorUrl = new FormData(event.currentTarget).get("saleor-url");
      const manifestUrl = new URL("/api/manifest", window.location.origin);
      const redirectUrl = new URL(
        `/dashboard/apps/install?manifestUrl=${manifestUrl}`,
        saleorUrl as string
      ).href;

      window.open(redirectUrl, "_blank");
    }}
  >
    <TextField type="url" required label="Saleor URL" name="saleor-url" />
    <Button type="submit">Add to Saleor</Button>
  </form>
);

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
          <Link
            onClick={handleLinkClick}
            target="_blank"
            rel="noreferrer"
            href="https://github.com/saleor/app-examples"
          >
            App Examples repository
          </Link>
        </li>
        <li>
          <Link
            onClick={handleLinkClick}
            target="_blank"
            rel="noreferrer"
            href="https://github.com/saleor/saleor-app-sdk"
          >
            Saleor App SDK
          </Link>
        </li>
        <li>
          <Link
            onClick={handleLinkClick}
            target="_blank"
            href="https://docs.saleor.io/docs/3.x/developer/extending/apps/key-concepts"
            rel="noreferrer"
          >
            Apps documentation
          </Link>
        </li>
        <li>
          <Link
            onClick={handleLinkClick}
            target="_blank"
            href="https://github.com/saleor/saleor-cli"
            rel="noreferrer"
          >
            Saleor CLI
          </Link>
        </li>
      </ul>

      {appBridgeState?.ready && mounted ? (
        <ClientContent />
      ) : (
        <div>
          <p>Install this app in your Dashboard and check extra powers!</p>
          {mounted && !global.location.href.includes("localhost") && <AddToSaleorForm />}
        </div>
      )}
    </div>
  );
};

export default IndexPage;
