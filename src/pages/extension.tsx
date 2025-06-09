import { useAppBridge } from "@saleor/app-sdk/app-bridge";
import { Box, Text } from "@saleor/macaw-ui";
import { useParams } from "next/navigation";

const ExtensionPage = () => {
  const { appBridgeState } = useAppBridge();
  const params = useParams();

  return (
    <Box display="grid">
      <Text>Extension page - app bridge state</Text>
      <Box as="pre">{JSON.stringify(appBridgeState, null, 2)}</Box>
      <Text>Query params</Text>
      <Box as="pre">{JSON.stringify(params, null, 2)}</Box>
    </Box>
  );
};

export default ExtensionPage;
