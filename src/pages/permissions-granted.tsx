import { useAppBridge } from "@saleor/app-sdk/app-bridge";
import { NextPage } from "next";
import { useRouter } from "next/router";

const Page: NextPage = () => {
  const { appBridgeState } = useAppBridge();

  const { query } = useRouter();

  if (query.error) {
    return (
      <div>
        <h1>Permissions denied </h1>
        <p>Dashboard returned error: {query.error}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Permissions Granted</h1>
      <code>
        <pre>{JSON.stringify(appBridgeState, null, 2)}</pre>
      </code>
    </div>
  );
};

export default Page;
