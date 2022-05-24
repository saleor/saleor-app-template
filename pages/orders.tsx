import { useEffect, useState } from "react";
import type { NextPage } from "next";

import { useFetchVariousNumberOfOrdersQuery } from "../generated/graphql";
import useApp from "../hooks/useApp";
import { SALEOR_DOMAIN_HEADER } from "../constants";

const Orders: NextPage = () => {
  const appState = useApp()?.getState();
  const [numberOfOrders, setNumberOfOrders] = useState<number | undefined>();

  useEffect(() => {
    appState?.domain && appState?.token && fetch(
      "/api/orders",
      { headers: [
        [SALEOR_DOMAIN_HEADER, appState.domain],
        ["authorization-bearer", appState.token!],
      ] },
    )
      .then((res) => res.json())
      .then(({ data: { number_of_orders } }) => setNumberOfOrders(parseInt(number_of_orders)));
  }, [appState]);

  const [{ data }] = useFetchVariousNumberOfOrdersQuery({
    variables: { number_of_orders: numberOfOrders as number },
    pause: numberOfOrders === undefined,
  });

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
