import type { NextPage } from "next";

import { useFetchTwelveOrdersQuery } from "../generated/graphql";

const Orders: NextPage = () => {
  const [{ data }] = useFetchTwelveOrdersQuery();

  return (
    <div>
      <main>
        <div className="text-white">Saleor App Template - Orders in Dashboard extensions</div>
        <div className="text-white">{JSON.stringify(data)}</div>
      </main>
    </div>
  );
};

export default Orders;
