import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { AppBridgeState } from "@saleor/app-bridge";


import { SALEOR_DOMAIN_HEADER } from "../constants";
import { useFetchTwelveOrdersQuery } from "../generated/graphql";
import useApp from "../hooks/useApp";

const Configuration: NextPage = () => {
  const appState = useApp()?.getState();

  const [configuration, setConfiguration] = useState(null);
  const [{ data: orders }] = useFetchTwelveOrdersQuery();

  useEffect(() => {
    appState?.domain && appState?.token && fetch(
        "/api/configuration",
        { headers: [
          [SALEOR_DOMAIN_HEADER, appState.domain],
          ["authorization-bearer", appState.token!],
        ] },
      )
        .then((res) => res.json())
        .then(({ data }) => setConfiguration(data))
  }, [appState]);

  if (!appState?.ready) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div>
      <main>
        <div className="text-white">Saleor App Template - Configuration</div>
        <div className="text-white">{appState?.domain}</div>
        <div className="text-white">{JSON.stringify(orders)}</div>
        <div className="text-white">{JSON.stringify(configuration)}</div>
      </main>
    </div>
  );
};

export default Configuration;
