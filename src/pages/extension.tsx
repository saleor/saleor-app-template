import { useAppBridge } from "@saleor/app-sdk/app-bridge";
import { Box, Text } from "@saleor/macaw-ui";
import { useSearchParams } from "next/navigation";

const ExtensionPage = () => {
  const { appBridgeState } = useAppBridge();
  const searchParams = useSearchParams();
  const params: { [key: string]: string } = {};

  searchParams.forEach((value, key) => {
    params[key] = value;
  });

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
