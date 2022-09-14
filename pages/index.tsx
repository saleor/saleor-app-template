import { useAppBridge } from "@saleor/app-sdk/app-bridge";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import LoadingPage from "../components/LoadingPage/LoadingPage";

function Index() {
  const { appBridgeState } = useAppBridge();
  const [isBrowser, setIsBrowser] = useState(false);
  const router = useRouter();

  const domain = appBridgeState?.domain;

  useEffect(() => {
    // If the homepage is rendered at dashboard, redirect to the configuration
    if (domain && isBrowser) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      router.replace("/configuration", { query: window.location.search });
    }
  }, [isBrowser, domain]);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const hostname = isBrowser ? window.location.hostname : undefined;
  const isTunnel = hostname?.includes("saleor.live");

  if (!isBrowser || appBridgeState?.domain) {
    return <LoadingPage />;
  }

  return (
    <div>
      <Head>
        <title>Saleor App Boilerplate</title>
        <meta name="description" content="Extend Saleor with Apps with ease." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div>
          <h1>🦄 🎉 Your app is up and running.</h1>
          <p>Welcome in the Saleor App Boilerplate.</p>
        </div>
        <div>
          <h2>Next steps:</h2>
          <ul>
            {!isTunnel && (
              <li>
                <span>Use Saleor CLI to setup a live tunnel to your Cloud environment:</span>
                <br />
                <code>saleor app tunnel</code>
              </li>
            )}
            {isTunnel && (
              <li>
                <span>You are accessing your Saleor App via the tunnel</span>
                <br />
                <code>{hostname}</code>
              </li>
            )}
            <li>
              <span>Write your first webhook:</span>
              <br />
              <code>saleor app generate webhook</code>
            </li>
          </ul>
        </div>

        <div>
          <h2>Additional resources:</h2>
          <ul>
            <li>
              <a
                href="https://docs.saleor.io/docs/3.x/developer/extending/apps/asynchronous-webhooks"
                target="_blank"
                rel="noopener noreferrer"
              >
                Saleor Asynchronous Webhooks
              </a>
            </li>
            <li>
              <a
                href="https://docs.saleor.io/docs/3.x/developer/extending/apps/synchronous-webhooks"
                target="_blank"
                rel="noopener noreferrer"
              >
                Saleor Synchronous Webhooks
              </a>
            </li>
            <li>
              If you&apos;re new to Next.js make sure to check out{" "}
              <a target="_blank" rel="noopener noreferrer" href="https://nextjs.org/learn">
                Next.js Tutorial
              </a>
            </li>
          </ul>
        </div>
      </main>

      <footer>
        Powered by{" "}
        <a href="https://saleor.io" target="_blank" rel="noopener noreferrer">
          <span>Saleor</span>
        </a>
      </footer>
    </div>
  );
}

export default Index;
