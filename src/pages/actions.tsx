import { useAppBridge } from "@saleor/app-sdk/app-bridge";
import { Button, Text, Box } from "@saleor/macaw-ui/next";
import { useOrdersQuery } from "../../generated/graphql";

/**
 * This is example of using AppBridge, when App is mounted in Dashboard
 * See more about AppBridge possibilities
 * https://github.com/saleor/saleor-app-sdk/blob/main/docs/app-bridge.md
 *
 * -> You can safely remove this file!
 */
const ActionsPage = () => {
  const { appBridge, appBridgeState } = useAppBridge();
  const [{ data, fetching }] = useOrdersQuery();

  const navigateToOrders = () => {
    appBridge?.dispatch({
      type: "redirect",
      payload: {
        to: "/orders",
        actionId: "message-from-app",
      },
    });
  };

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
    <Box padding={8} display={"flex"} flexDirection={"column"} gap={6} __maxWidth={"640px"}>
      <Box>
        <Text as={"p"}>
          <b>Welcome {appBridgeState?.user?.email}!</b>
        </Text>
        <Text as={"p"}>Installing the app in the Dashboard gave it superpowers such as:</Text>
      </Box>
      <Box>
        <Text as={"h2"} variant={"heading"} marginBottom={2}>
          AppBridge actions
        </Text>
        <Text color="textNeutralSubdued">
          💡 You can use AppBridge to trigger dashboard actions, such as notifications or redirects.
        </Text>
        <Box display={"flex"} gap={4} gridAutoFlow={"column"} marginY={4}>
          <Button
            variant={"secondary"}
            onClick={() => {
              appBridge?.dispatch({
                type: "notification",
                payload: {
                  status: "success",
                  title: "You rock!",
                  text: "This notification was triggered from Saleor App",
                  actionId: "message-from-app",
                },
              });
            }}
          >
            Trigger notification 📤
          </Button>
          <Button variant={"secondary"} onClick={navigateToOrders}>
            Redirect to orders ➡️💰
          </Button>
        </Box>
      </Box>
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
                      href={`https://pikle.eu.saleor.cloud/dashboard/orders/${order.node.id}`}
                    >{`Order ${order.node.number}`}</a>{" "}
                    {`is ${order.node.status}`}
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      </Box>
      <Box display="flex" flexDirection={"column"} gap={2}>
        <Text as={"h2"} variant={"heading"}>
          Webhooks
        </Text>
        <Text>
          The App Template contains an example <code>ORDER_CREATED</code> webhook under the path{" "}
          <code>src/pages/api/order-created</code>.
        </Text>

        <Text as="p">
          Create any{" "}
          <Text
            as={"a"}
            variant={"bodyStrong"}
            onClick={navigateToOrders}
            cursor={"pointer"}
            color={"text3Decorative"}
          >
            Order
          </Text>{" "}
          and check your console output!
        </Text>
      </Box>
    </Box>
  );
};

export default ActionsPage;
