import { useAppBridge } from "@saleor/app-sdk/app-bridge";
import { Button, Text, Box } from "@saleor/macaw-ui/next";

/**
 * This is example of using AppBridge, when App is mounted in Dashboard
 * See more about AppBridge possibilities
 * https://github.com/saleor/saleor-app-sdk/blob/main/docs/app-bridge.md
 *
 * -> You can safely remove this file!
 */
export const DashboardActions = () => {
  const { appBridge, appBridgeState } = useAppBridge();

  const navigateToOrders = () => {
    appBridge?.dispatch({
      type: "redirect",
      payload: {
        to: "/orders",
        actionId: "message-from-app",
      },
    });
  };

  return (
    <div>
      <Text as={"h2"} variant={"heading"} >
        App running in the Dashboard!
      </Text>
      <Text marginBottom={6} as={"p"}>Welcome {appBridgeState?.user?.email}</Text>
      <Box display={"flex"} gap={4} gridAutoFlow={"column"} marginBottom={6}>
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
      <Text as={"h2"} variant={"heading"} marginBottom={6}>
        Webhooks
      </Text>
      <Text>
        App template contains example of webhook. You can create any{" "}
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
    </div>
  );
};

/**
 * Export default for Next.dynamic
 */
export default DashboardActions;
