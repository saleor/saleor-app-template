import { NextPage } from "next";
import { useAppBridge } from "@saleor/app-sdk/app-bridge";
import dynamic from "next/dynamic";
import { MouseEventHandler, useEffect, useState } from "react";
import { Box, Input, Text, Button } from "@saleor/macaw-ui/next";

const ClientContent = dynamic(() => import("../DashboardActions"), {
  ssr: false,
});

const AddToSaleorForm = () => (
  <Box as={"form"} display={"flex"} alignItems={"center"} gap={4}
    onSubmit={(event) => {
      event.preventDefault();

      const saleorUrl = new FormData(event.currentTarget as HTMLFormElement).get("saleor-url");
      const manifestUrl = new URL("/api/manifest", window.location.origin);
      const redirectUrl = new URL(
        `/dashboard/apps/install?manifestUrl=${manifestUrl}`,
        saleorUrl as string
      ).href;

      window.open(redirectUrl, "_blank");
    }}
  >
    <Input type="url" required label="Saleor URL" name="saleor-url" />
    <Button type="submit">Add to Saleor</Button>
  </Box>
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
    <Box padding={8}>
      <Text variant={"hero"}>Welcome to Saleor App Template (Next.js) 🚀</Text>
      <Text as={"p"} marginTop={8}>
        This is a boilerplate you can start with, to create an app connected to Saleor
      </Text>
      <Text variant={"heading"} marginTop={8} as={"h2"}>
        Resources
      </Text>
      <ul>
        <li>
          <a
            onClick={handleLinkClick}
            target="_blank"
            rel="noreferrer"
            href="https://github.com/saleor/app-examples"
          >
            <Text color={"text3Decorative"}>App Examples repository</Text>
          </a>
        </li>
        <li>
          <a
            onClick={handleLinkClick}
            target="_blank"
            rel="noreferrer"
            href="https://github.com/saleor/saleor-app-sdk"
          >
            <Text color={"text3Decorative"}>Saleor App SDK</Text>
          </a>
        </li>
        <li>
          <a
            onClick={handleLinkClick}
            target="_blank"
            href="https://docs.saleor.io/docs/3.x/developer/extending/apps/key-concepts"
            rel="noreferrer"
          >
            <Text color={"text3Decorative"}>Apps documentation </Text>
          </a>
        </li>
        <li>
          <a
            onClick={handleLinkClick}
            target="_blank"
            href="https://github.com/saleor/saleor-cli"
            rel="noreferrer"
          >
            <Text color={"text3Decorative"}>Saleor CLI</Text>
          </a>
        </li>
        <li>
          <a
            onClick={handleLinkClick}
            target="_blank"
            href="https://macaw-ui-next.vercel.app/?path=/docs/getting-started-installation--docs"
            rel="noreferrer"
          >
            <Text color={"text3Decorative"}>Macaw UI - storybook</Text>
          </a>
        </li>
        <li>
          <a
            onClick={handleLinkClick}
            target="_blank"
            href="https://github.com/saleor/apps"
            rel="noreferrer"
          >
            <Text color={"text3Decorative"}>Saleor Apps - official apps by Saleor Team</Text>
          </a>
        </li>
      </ul>

      {appBridgeState?.ready && mounted ? (
        <ClientContent />
      ) : (
        <>
          <Text marginBottom={4} as={"p"}>Install this app in your Dashboard and check extra powers!</Text>
          {mounted && !global.location.href.includes("localhost") && <AddToSaleorForm />}
        </>
      )}
    </Box>
  );
};

export default IndexPage;
