import { actions, useAppBridge, useWidgetAutoResize } from "@saleor/app-sdk/app-bridge";
import { Box, Button, Text } from "@saleor/macaw-ui";
import { useRef } from "react";

import {
  getCompletedProductLaunchItemCount,
  productLaunchChecklist,
} from "@/product-launch-checklist";

/**
 * A compact product readiness summary displayed on the product details page.
 * Merchants can open the complete checklist without leaving their current task.
 */
const ProductLaunchWidget = () => {
  const { appBridge } = useAppBridge();
  const rootRef = useRef<HTMLDivElement>(null);

  useWidgetAutoResize(rootRef);

  const completedItems = getCompletedProductLaunchItemCount(productLaunchChecklist);
  const remainingItem = productLaunchChecklist.find((item) => !item.completed);

  const openChecklist = () => {
    appBridge?.dispatch(
      actions.OpenPopup({
        extensionIdentifier: "product-launch-checklist",
        params: {
          items: productLaunchChecklist,
        },
      })
    );
  };

  return (
    <Box ref={rootRef} padding={6} display="flex" flexDirection="column" gap={4}>
      <Text as="h2" size={6}>
        Product launch
      </Text>
      <Text color="default2">
        {completedItems} of {productLaunchChecklist.length} checks complete. {remainingItem?.label}{" "}
        still needs attention before publishing.
      </Text>
      <Button variant="primary" onClick={openChecklist}>
        Review launch checklist
      </Button>
    </Box>
  );
};

export default ProductLaunchWidget;
