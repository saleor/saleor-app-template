import { actions, useAppBridge } from "@saleor/app-sdk/app-bridge";
import { Box, Button, Input, Text } from "@saleor/macaw-ui";
import { NextPage } from "next";
import Link from "next/link";
import { MouseEventHandler, useEffect, useState } from "react";

const AddToSaleorForm = () => (
  <Box
    as={"form"}
    display={"flex"}
    alignItems={"center"}
    gap={4}
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

  const isLocalHost = global.location.href.includes("localhost");

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

      <Text as={"p"} marginTop={8}>
        Explore the App Template by visiting:
      </Text>
      <ul>
        <li>
          <code>/src/pages/api/manifest</code> - the{" "}
          <a
            href="https://docs.saleor.io/docs/3.x/developer/extending/apps/manifest"
            target="_blank"
            rel="noreferrer"
          >
            App Manifest
          </a>
          .
        </li>
        <li>
          <code>/src/pages/api/webhooks/order-created</code> - an example <code>ORDER_CREATED</code>{" "}
          webhook handler.
        </li>
        <li>
          <code>/graphql</code> - the pre-defined GraphQL queries.
        </li>
        <li>
          <code>/generated/graphql.ts</code> - the code generated for those queries by{" "}
          <a target="_blank" rel="noreferrer" href="https://the-guild.dev/graphql/codegen">
            GraphQL Code Generator
          </a>
          .
        </li>
      </ul>
      <Text variant={"heading"} marginTop={8} as={"h2"}>
        Resources
      </Text>
      <ul>
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
            rel="noreferrer"
            href="https://docs.saleor.io/docs/3.x/developer/extending/apps/developing-with-tunnels"
          >
            <Text color={"text3Decorative"}>Tunneling the app</Text>
          </a>
        </li>
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
            href="https://github.com/saleor/apps"
            rel="noreferrer"
          >
            <Text color={"text3Decorative"}>Saleor App Store - official apps by Saleor Team</Text>
          </a>
        </li>
        <li>
          <a
            onClick={handleLinkClick}
            target="_blank"
            href="https://macaw-ui-next.vercel.app/?path=/docs/getting-started-installation--docs"
            rel="noreferrer"
          >
            <Text color={"text3Decorative"}>Macaw UI - official Saleor UI library</Text>
          </a>
        </li>
        <li>
          <a
            onClick={handleLinkClick}
            target="_blank"
            href="https://nextjs.org/docs"
            rel="noreferrer"
          >
            <Text color={"text3Decorative"}>Next.js documentation</Text>
          </a>
        </li>
      </ul>

      {mounted && !isLocalHost && !appBridgeState?.ready && (
        <>
          <Text marginBottom={4} as={"p"}>
            Install this app in your Dashboard and get extra powers!
          </Text>
          <AddToSaleorForm />
        </>
      )}
    </Box>
  );
};

export default IndexPage;
