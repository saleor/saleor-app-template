import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'

const Home: NextPage = () => {
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
            <li>
              <span>Use Saleor CLI to setup a live tunnel to your Cloud environment:</span><br/>
              <code>saleor app tunnel</code>
            </li>
            <li>
              <span>Write your first webhook:</span><br/>
              <code>saleor webhook generate</code>
            </li>
            <li><a target="_blank" href="">Go to your App's Dashboard</a></li>
            <li><a target="_blank" href="">Explore your GraphQL API</a></li>
          </ul>
        </div>

        <div>
          <h2>Additional resources:</h2>
          <ul>
            <li><a target="_blank" href="https://docs.saleor.io/docs/3.x/developer/extending/apps/asynchronous-webhooks">Saleor Asynchrnous Webhooks</a></li>
            <li><a target="_blank" href="https://docs.saleor.io/docs/3.x/developer/extending/apps/synchronous-webhooks">Saleor Synchrnous Webhooks</a></li>
            <li>If you're new to Next.js make sure to check out <a target="_blank" href="https://nextjs.org/learn">Next.js Tutorial</a></li>
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
  )
}

export default Home
