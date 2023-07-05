import { useAppBridge } from "@saleor/app-sdk/app-bridge";
import { Box, Text } from "@saleor/macaw-ui/next";
import React from "react";
import { useOrdersQuery } from "../generated/graphql";

export const OrderExample = () => {
  const { appBridge } = useAppBridge();

  const [{ data, fetching }] = useOrdersQuery();
  const navigateToOrder = (id: string) => {
    appBridge?.dispatch({
      type: "redirect",
      payload: {
        to: `/orders/${id}`,
        actionId: "message-from-app",
      },
    });
  };

  return (
    <Box display="flex" flexDirection={"column"} gap={2}>
      <Text as={"h2"} variant={"heading"}>
        Fetching data
      </Text>

      <>
        {fetching ? (
          <Text>Fetching orders...</Text>
        ) : (
          <>
            <Text color="textNeutralSubdued">
              💡 You can modify the query in the <code>graphql/queries/Orders.graphql</code> file.
              Remember to run <code>pnpm codegen</code> afterwards to regenerate the types.
            </Text>
            <ul style={{ listStyle: "inside", margin: 0 }}>
              {data?.orders?.edges?.map((order) => (
                <li key={order.node.id}>
                  <a
                    onClick={() => navigateToOrder(order.node.id)}
                    href={`/orders/${order.node.id}`}
                  >{`Order ${order.node.number}`}</a>{" "}
                  {`is ${order.node.status}`}
                </li>
              ))}
            </ul>
          </>
        )}
      </>
    </Box>
  );
};
