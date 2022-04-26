# Saleor App Template

Bare-bones Saleor App template to start with.

Useful resources:

[Apps guide](https://docs.saleor.io/docs/3.x/developer/extending/apps/key-concepts)

[Configuring apps in dashboard](https://docs.saleor.io/docs/3.x/dashboard/apps)

[Saleor CLI guide](https://docs.saleor.io/docs/3.x/dashboard/apps)

## Installation

### From Saleor CLI

Saleor CLI is a tool which allows to manage your Saleor Cloud resources directly from the command line.

[Saleor CLI guide] (https://docs.saleor.io/docs/3.x/developer/extending/apps/key-concepts)

```
saleor app create [your-app-name]
```

The Saleor CLI will:
- clone this repository to the specified folder
- install dependencies
- ask you weather you'd like to install the app in the environment
- create `.env` file
- create tunnel so you can test the app integration with the environment
- start the app in development mode

### Manual

1. Update Saleor URI in the `.env`. If you don't have running instance of Saleor, you create a [free dev account](https://cloud.saleor.io/)
   or run instance [locally](https://github.com/saleor/saleor-platform)
2. You'll need [pnpm](https://pnpm.io/installation) `npm install -g pnpm` to install dependencies.


## How to add app to Saleor?

### From Saleor CLI

Use the `saleor` command from the app project directory

```
saleor app install
```

### Manual

For local development you can use tunnel feature build in Saleor CLI

```
saleor app tunnel
```

or you can you can use [localtunnel](https://github.com/localtunnel/localtunnel) or [ngrok](https://ngrok.com/) to expose your app.

1. Start App dev server

```
$ yarn dev
```

2. Run `appInstall` mutation from graphql client (MANAGE_APPS permission required!)

```
mutation {
  appInstall(
    input: {
      appName: "Saleor App Template"
      manifestUrl: "https://your.app.url.saleor.live"
      permissions: [MANAGE_PRODUCTS]
    }
  ) {
    appInstallation {
      id
      status
      appName
      manifestUrl
    }
    appErrors {
      field
      message
      code
      permissions
    }
  }
}
```

3. That's it! 🦄