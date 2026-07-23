import { actions, useAppBridge } from "@saleor/app-sdk/app-bridge";
import { Box, Button, Spinner, Text } from "@saleor/macaw-ui";

import {
  getCompletedProductLaunchItemCount,
  type ProductLaunchChecklistItem,
} from "@/product-launch-checklist";

type ProductLaunchParams = {
  productName?: string;
  items?: ProductLaunchChecklistItem[];
};

const ProductLaunchChecklist = () => {
  const { appBridge, appBridgeState } = useAppBridge();
  const { productName, items = [] } =
    (appBridgeState?.appParams as ProductLaunchParams | undefined) ?? {};
  const completedItems = getCompletedProductLaunchItemCount(items);
  const remainingItems = items.length - completedItems;

  if (!appBridgeState?.ready) {
    return (
      <Box padding={8} display="flex" justifyContent="center">
        <Spinner />
      </Box>
    );
  }

  if (items.length === 0) {
    return (
      <Box padding={8} display="flex" flexDirection="column" gap={4} __maxWidth="480px">
        <Text color="critical1">Open this checklist from the product launch widget.</Text>
        <Button variant="secondary" onClick={() => appBridge?.dispatch(actions.PopupClose())}>
          Back to product
        </Button>
      </Box>
    );
  }

  const readinessMessage =
    remainingItems === 0
      ? "This product is ready to publish."
      : `Finish ${
          remainingItems === 1 ? "the remaining task" : `${remainingItems} remaining tasks`
        } before making this product available to customers.`;

  return (
    <Box padding={8} display="flex" flexDirection="column" gap={4} __maxWidth="480px">
      <Text as="h1" size={8}>
        Product launch checklist
      </Text>
      {productName && <Text fontWeight="bold">{productName}</Text>}
      <Text color="default2">
        {completedItems} of {items.length} checks complete. {readinessMessage}
      </Text>
      <Box as="ul" margin={0} paddingLeft={6}>
        {items.map((item) => (
          <li key={item.label}>
            <Text fontWeight={item.completed ? undefined : "bold"}>
              {item.completed ? "Complete" : "To do"} — {item.label}
            </Text>
          </li>
        ))}
      </Box>
      <Button variant="secondary" onClick={() => appBridge?.dispatch(actions.PopupClose())}>
        Back to product
      </Button>
    </Box>
  );
};

export default ProductLaunchChecklist;
