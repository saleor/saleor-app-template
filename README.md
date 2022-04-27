# Saleor App Template

Bare-bones boilerplate for writing Saleor Apps with Next.js.

### What's Saleor App in a nutshell 
Saleor App is the fastest way of extending Saleor with custom logic using asynchronous and synchronous webhooks (and vast Saleor's API). In most cases, creating an App consists of two tasks:
* Writing webhook's code realizing your custom login
* Developing configuration UI that can be exposed to Saleor Dashboard via specialized view (designated in App's manifest).

### Why Next.js
You can use any preferred technology to create Saleor Apps, but Next.js is among the most efficient for two reasons. The first is the simplicity of maintaining your API endpoints/webhooks and your apps' configuration React front-end in a single, well-organized project. The second reason is the ease and quality of local development and deployment.

### Learn more about Apps

[Apps guide](https://docs.saleor.io/docs/3.x/developer/extending/apps/key-concepts)

[Configuring apps in dashboard](https://docs.saleor.io/docs/3.x/dashboard/apps)

## How to use this project

### Saleor CLI for the win 🚀
[Saleor CLI](https://github.com/saleor/saleor-cli) is designed to save you from the repetitive chores around Saleor development, including creating Apps. It will take the burden of spawning new apps locally, connecting them with Saleor environments, and establishing a tunnel for local development in seconds.

[Full Saleor CLI reference](https://docs.saleor.io/docs/3.x/developer/cli)

If you don't have (free developer) Saleor Cloud account create one with the following command:
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
or 
```
npm run dev
```

### Manual installation
If you don't want to use our CLI tool, just clone this repository and use standard tools instead. Learn how to [install your app manually](https://docs.saleor.io/docs/3.x/developer/extending/apps/installing-apps#installation-using-graphql-api) at any Saleor instance from our general docs and use tunneling tools like [localtunnel](https://github.com/localtunnel/localtunnel) or [ngrok](https://ngrok.com/) in order to expose it to the external world if needed.


That's it! 🦄
