import { exampleJSONConfiguration } from "./lib/confSchema";
import { JSONConfigurationForm } from "./lib/JSONConfigurationForm";

/**
 * This is example of using AppBridge, when App is mounted in Dashboard
 * See more about AppBridge possibilities
 * https://github.com/saleor/saleor-app-sdk/blob/main/docs/app-bridge.md
 *
 * You can safely remove this file!
 */
export const DashboardActions = () => {
  return (
    <div>
      <div>
        <JSONConfigurationForm JSONConf={exampleJSONConfiguration} />
      </div>
    </div>
  );
};

/**
 * Export default for Next.dynamic
 */
export default DashboardActions;
