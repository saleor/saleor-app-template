import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";

const Index: NextPage = () => {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const hostname = isBrowser ? window.location.hostname : undefined;
  const isTunnel = hostname?.includes("saleor.live");

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
            {!isTunnel && <li>
              <span>Use Saleor CLI to setup a live tunnel to your Cloud environment:</span><br/>
              <code>saleor app tunnel</code>
            </li>}
            { isTunnel && <li>
              <span>You are accessing your Saleor App via the tunnel</span><br/>
              <code>{hostname}</code>
            </li>}
            <li>
              <span>Write your first webhook:</span><br/>
              <code>saleor app generate webhook</code>
            </li>
            <li><a target="_blank" href="">Go to your App&apos;s Dashboard</a></li>
            <li><a target="_blank" href="">Explore your GraphQL API</a></li>
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
                Saleor Asynchrnous Webhooks
              </a>
            </li>
            <li>
              <a
                href="https://docs.saleor.io/docs/3.x/developer/extending/apps/synchronous-webhooks"
                target="_blank"
                rel="noopener noreferrer"
              >
                Saleor Synchrnous Webhooks
              </a>
            </li>
            <li>
              If you&apos;re new to Next.js make sure to check out <a target="_blank" rel="noopener noreferrer" href="https://nextjs.org/learn">Next.js Tutorial</a></li>
          </ul>
        </div>

      </main>

      <footer>
        Powered by{' '}
        <a
          href="https://saleor.io"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>
            Saleor
          </span>
        </a>
      </footer>
    </div>
  );
};

export default Index;
