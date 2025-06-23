<div align="center">
<img width="150" alt="saleor-app-template" src="https://user-images.githubusercontent.com/4006792/215185065-4ef2eda4-ca71-48cc-b14b-c776e0b491b6.png">
</div>

<div align="center">
  <h1>Saleor App Template</h1>
</div>

<div align="center">
  <p>Bare-bones boilerplate for writing Saleor Apps with Next.js.</p>
</div>

<div align="center">
  <a href="https://saleor.io/">Website</a>
  <span> | </span>
  <a href="https://docs.saleor.io/docs/3.x/">Docs</a>
  <span> | </span>
    <a href="https://githubbox.com/saleor/saleor-app-template">CodeSandbox</a>
</div>

> [!TIP]
> Questions or issues? Check our [discord](https://discord.gg/H52JTZAtSH) channel for help.

### What is Saleor App

Saleor App is the fastest way of extending Saleor with custom logic using [asynchronous](https://docs.saleor.io/docs/3.x/developer/extending/apps/asynchronous-webhooks) and [synchronous](https://docs.saleor.io/docs/3.x/developer/extending/apps/synchronous-webhooks/key-concepts) webhooks (and vast Saleor's API). In most cases, creating an App consists of two tasks:

- Writing webhook's code executing your custom logic.
- Developing configuration UI to be displayed in Saleor Dashboard via specialized view (designated in the App's manifest).

### What's included?

- 🚀 Communication between Saleor instance and Saleor App
- 📖 Manifest with webhooks using custom query

### Why Next.js

You can use any preferred technology to create Saleor Apps, but Next.js is among the most efficient for two reasons. The first is the simplicity of maintaining your API endpoints/webhooks and your apps' configuration React front-end in a single, well-organized project. The second reason is the ease and quality of local development and deployment.

### Learn more about Apps

[Apps guide](https://docs.saleor.io/docs/3.x/developer/extending/apps/key-concepts)

## Development

#### Running app locally in development containers

The easiest way of running app for local development is to use [development containers](https://containers.dev/).
If you have Visual Studio Code follow their [guide](https://code.visualstudio.com/docs/devcontainers/containers#_quick-start-open-an-existing-folder-in-a-container) on how to open existing folder in container.

Development container only creates container, you still need to start the server.

Development container will have port opened:

1. `3000` - were app dev server will listen to requests

### Requirements

Before you start, make sure you have installed:

- [Node.js 22](https://nodejs.org/en/)
- [pnpm 9](https://pnpm.io/)

1. Install the dependencies by running:

```
pnpm install
```

2. Start the local server with:

```
pnpm dev
```

3. Expose local environment using tunnel:
   Use tunneling tools like [localtunnel](https://github.com/localtunnel/localtunnel) or [ngrok](https://ngrok.com/).

4. Install the application in your dashboard:

If you use Saleor Cloud or your local server is exposed, you can install your app by following this link:

```
[YOUR_SALEOR_DASHBOARD_URL]/apps/install?manifestUrl=[YOUR_APP_TUNNEL_MANIFEST_URL]
```

This template host manifest at `/api/manifest`

You can also install application using GQL or command line. Follow the guide [how to install your app](https://docs.saleor.io/docs/3.x/developer/extending/apps/installing-apps#installation-using-graphql-api) to learn more.

### Generated schema and typings

This project uses a `generate` npm script command to:

- Generate GraphQL schema and typed functions from Saleor's GraphQL endpoint.
- Generate types for Saleor sync webhook responses from JSON schema

Commit the `generated` folder to your repo as they are necessary for queries and keeping track of the GraphQL / JSON schema changes.

To generate GraphQL types we are using [GraphQL Codegen](https://www.graphql-code-generator.com/). For generating types from JSON schema we use [json-schema-to-typescript](https://www.npmjs.com/package/json-schema-to-typescript).

### Storing registration data - APL

During the registration process, Saleor API passes the auth token to the app. With this token App can query Saleor API with privileged access (depending on requested permissions during the installation).
To store this data, app-template use a different [APL interfaces](https://docs.saleor.io/developer/extending/apps/developing-apps/app-sdk/apl).

The choice of the APL is made using the `APL` environment variable. If the value is not set, FileAPL is used. Available choices:

- `file`: no additional setup is required. Good choice for local development. It can't be used for multi tenant-apps or be deployed (not intended for production)
- `upstash`: use [Upstash](https://upstash.com/) Redis as storage method. Free account required. It can be used for development and production and supports multi-tenancy. Requires `UPSTASH_URL` and `UPSTASH_TOKEN` environment variables to be set

If you want to use your own database, you can implement your own APL. [Check the documentation to read more](https://docs.saleor.io/developer/extending/apps/developing-apps/app-sdk/apl).
