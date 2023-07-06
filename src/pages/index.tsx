import { actions, useAppBridge } from "@saleor/app-sdk/app-bridge";
import { Box, Button, Text } from "@saleor/macaw-ui/next";
import { NextPage } from "next";
import Link from "next/link";
import { MouseEventHandler, useEffect, useState } from "react";

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

      appBridge?.dispatch(
        actions.Redirect({
          newContext: true,
          to: e.currentTarget.href,
        })
      );
    }

    /**
     * Otherwise, assume app is accessed outside of Dashboard, so href attribute on <a> will work
     */
  };

  return (
    <Box padding={8}>
      <Text variant={"hero"}>Welcome to Saleor App Template (Next.js) 🚀</Text>
      <Text as={"p"} marginY={4}>
        Saleor App Template is a minimalistic boilerplate that provides a working example of a
        Saleor app.
      </Text>
      {appBridgeState?.ready && mounted && (
        <Link href="/actions">
          <Button variant="secondary">See what your app can do →</Button>
        </Link>
      )}

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
    </Box>
  );
};

export default IndexPage;
