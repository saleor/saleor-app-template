import type { NextPage } from "next";
import { useEffect, useState } from "react";

import { useFetchTwelveOrdersQuery } from "../generated/graphql";
import useApp from "../hooks/useApp";

const Configuration: NextPage = () => {
  const [{ data }] = useFetchTwelveOrdersQuery();
  const app = useApp();
  const [domain, setDomain] = useState("");

  useEffect(() => setDomain(app?.getState()!.domain || ""), [app]);

  return (
    <div>
      <main>
        <div className="text-white">Saleor App Template - Configuration</div>
        <div className="text-white">{domain}</div>
        {JSON.stringify(data)}
      </main>
    </div>
  );
};

export default Configuration;
