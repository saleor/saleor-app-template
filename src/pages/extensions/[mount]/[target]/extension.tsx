import { NextPage } from "next";
import { useAppBridge } from "@saleor/app-sdk/app-bridge";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

// Use query params to create universal page component
// Its for the example purposes - you can create a static path dedicated to extension
const ExtensionPage: NextPage = () => {
  const { appBridgeState } = useAppBridge();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!appBridgeState?.ready || !mounted) {
    return <div>Waiting for app bridge</div>;
  }

  const query = router.query;
  return (
    <div>
      <h1>🎉 Greetings from the app extension!</h1>
      <p>
        Mount: <strong>{query.mount}</strong>
      </p>
      <p>
        Target: <strong>{query.target}</strong>
      </p>
      <p>All properties available from URL query:</p>
      <pre>{JSON.stringify(query, null, 2)}</pre>
    </div>
  );
};

export default ExtensionPage;
