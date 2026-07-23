import { actions, useAppBridge, useWidgetAutoResize } from "@saleor/app-sdk/app-bridge";
import { Box, Button, Spinner, Text } from "@saleor/macaw-ui";
import { useRouter } from "next/router";
import { useRef } from "react";

import { useProductLaunchReadinessQuery } from "@/generated/graphql";
import {
  createProductLaunchChecklist,
  getCompletedProductLaunchItemCount,
} from "@/product-launch-checklist";

/**
 * Fetches a product readiness summary for the product currently open in Dashboard.
 */
const ProductLaunchWidget = () => {
  const { appBridge, appBridgeState } = useAppBridge();
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const productId = typeof router.query.productId === "string" ? router.query.productId : undefined;

  useWidgetAutoResize(rootRef);

  const [{ data, fetching, error }] = useProductLaunchReadinessQuery({
    variables: { id: productId ?? "" },
    pause: !productId || !appBridgeState?.ready,
  });
  const product = data?.product;
  const checklist = product ? createProductLaunchChecklist(product) : [];
  const completedItems = getCompletedProductLaunchItemCount(checklist);
  const remainingItems = checklist.length - completedItems;

  const openChecklist = () => {
    if (!product) {
      return;
    }

    appBridge?.dispatch(
      actions.OpenPopup({
        extensionIdentifier: "product-launch-checklist",
        params: {
          productName: product.name,
          items: checklist,
        },
      })
    );
  };

  if (!router.isReady || !appBridgeState?.ready || (fetching && !product)) {
    return (
      <Box ref={rootRef} padding={6} display="flex" justifyContent="center">
        <Spinner />
      </Box>
    );
  }

  if (!productId || error || !product) {
    const errorMessage = !productId
      ? "Open this widget from a product's detail page."
      : error
      ? "Couldn't check this product's launch readiness."
      : "Product not found.";

    return (
      <Box ref={rootRef} padding={6}>
        <Text color="critical1">{errorMessage}</Text>
      </Box>
    );
  }

  return (
    <Box ref={rootRef} padding={6} display="flex" flexDirection="column" gap={4}>
      <Text as="h2" size={6}>
        Product launch
      </Text>
      <Text color="default2">
        {completedItems} of {checklist.length} checks complete.{" "}
        {remainingItems === 0
          ? "This product is ready to publish."
          : `${remainingItems} ${
              remainingItems === 1 ? "item needs" : "items need"
            } attention before publishing.`}
      </Text>
      <Button variant="primary" onClick={openChecklist}>
        Review launch checklist
      </Button>
    </Box>
  );
};

export default ProductLaunchWidget;
