![Saleor App Template](https://user-images.githubusercontent.com/249912/71523206-4e45f800-28c8-11ea-84ba-345a9bfc998a.png)

<div align="center">
  <h1>Saleor App Template</h1>
</div>

<div align="center">
  <p>Bare-bones boilerplate for writing Saleor Apps with Next.js.</p>
</div>

<div align="center">
  <a href="https://saleor.io/">🏠 Website</a>
  <span> • </span>
  <a href="https://docs.saleor.io/docs/3.x/">📚 Docs</a>
  <span> • </span>
  <a href="https://saleor.io/blog/">📰 Blog</a>
  <span> • </span>
  <a href="https://twitter.com/getsaleor">🐦 Twitter</a>
</div>

<div align="center">
  <a href="https://saleor-app-template.vercel.app/">▶️ Demo</a>
   <span> • </span>
  <a href="https://githubbox.com/saleor/saleor-app-template">🔎 Explore Code</a>
</div>


## About

### What is Saleor App

Saleor App is the fastest way of extending Saleor with custom logic using [asynchronous](https://docs.saleor.io/docs/3.x/developer/extending/apps/asynchronous-webhooks) and [synchronous](https://docs.saleor.io/docs/3.x/developer/extending/apps/synchronous-webhooks) webhooks (and vast Saleor's API). In most cases, creating an App consists of two tasks:

- Writing webhook's code executing your custom logic.
- Developing configuration UI to be displayed in Saleor Dashboard via specialized view (designated in the App's manifest).

### What's included?

- 🚀 Communication between Saleor instance and Saleor App
- ⚙️ Encapsulated Metadata and Private Metadata handling logic
- 📱 Configuration UI
- ⚡ Example of Webhook handling
- 🧭 Example of using App Extension
- 📖 Manifest with webhooks using custom query

### Why Next.js

You can use any preferred technology to create Saleor Apps, but Next.js is among the most efficient for two reasons. The first is the simplicity of maintaining your API endpoints/webhooks and your apps' configuration React front-end in a single, well-organized project. The second reason is the ease and quality of local development and deployment.

### Learn more about Apps

[Apps guide](https://docs.saleor.io/docs/3.x/developer/extending/apps/key-concepts)

[Configuring apps in dashboard](https://docs.saleor.io/docs/3.x/dashboard/apps)

## Development

### With CLI

The easiest way to set up a Saleor app is by using the Saleor CLI.

[Saleor CLI](https://github.com/saleor/saleor-cli) is designed to save you from the repetitive chores around Saleor development, including creating Apps. It will take the burden of spawning new apps locally, connecting them with Saleor environments, and establishing a tunnel for local development in seconds.

[Full Saleor CLI reference](https://docs.saleor.io/docs/3.x/developer/cli)

If you don't have a (free developer) Saleor Cloud account, create one with the following command:

```
saleor register
```

Now you're ready to create your first App:

```
saleor app create [your-app-name]
```

In this step, Saleor CLI will:

- clone this repository to the specified folder
- install dependencies
- ask you whether you'd like to install the app in the selected Saleor environment
- create `.env` file
- start the app in development mode

Having your app ready, the final thing you want to establish is a tunnel with your Saleor environment. Go to your app's directory first and run:

```
saleor app tunnel
```

Your local application should be available now to the outside world (Saleor instance) for accepting all the events via webhooks.

A quick note: the next time you come back to your project, it is enough to launch your app in a standard way (and then launch your tunnel as described earlier):

```
pnpm dev
```

### Without CLI

Add the URL of your Saleor instance to the `.env` file:

```
NEXT_PUBLIC_SALEOR_HOST_URL=https://your-saleor-instance.com
```

Install the dependencies by running:
```
pnpm install
```

Start the local server with:
```
pnpm run dev
```

Follow the guide [how to install your app](https://docs.saleor.io/docs/3.x/developer/extending/apps/installing-apps#installation-using-graphql-api) and use tunneling tools like [localtunnel](https://github.com/localtunnel/localtunnel) or [ngrok](https://ngrok.com/) to expose your local server.

If you use [saleor-dashboard](https://github.com/saleor/saleor-dashboard) and your local server is exposed, you can install your app by following this link:

```
[YOUR_SALEOR_DASHBOARD_URL]/apps/install?manifestUrl=[YOUR_APPS_MANIFEST_URL]
```

### Generated schema and typings

Commands `build` and `dev` would generate schema and typed functions using Saleor's GraphQL endpoint. Commit the `generated` folder to your repo as they are necessary for queries and keeping track of the schema changes.

[Learn more](https://www.graphql-code-generator.com/) about GraphQL code generation.
