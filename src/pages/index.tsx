import { NextPage } from "next";

/**
 * This is page publicly accessible from your app.
 * You should probably remove it.
 */
const IndexPage: NextPage = () => {
  return (
    <div>
      <h1>Welcome to Saleor App Template (Next.js) 🚀</h1>
      <p>
        This is a <strong>minimal</strong> boilerplate you can start with, to create an app
        connected to Saleor
      </p>
      <h2>Resources</h2>
      <ul>
        <li>
          <a target="_blank" rel="noreferrer" href="https://github.com/saleor/app-examples">
            App Examples repository
          </a>
        </li>
        <li>
          <a target="_blank" rel="noreferrer" href="https://github.com/saleor/saleor-app-sdk">
            Saleor App SDK
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://docs.saleor.io/docs/3.x/developer/extending/apps/key-concepts"
            rel="noreferrer"
          >
            Apps documentation
          </a>
        </li>
        <li>
          <a target="_blank" href="https://github.com/saleor/saleor-cli" rel="noreferrer">
            Saleor CLI
          </a>
        </li>
      </ul>
    </div>
  );
};

export default IndexPage;
