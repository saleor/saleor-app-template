import { useAppBridge, AppBridge } from "@saleor/app-sdk/app-bridge";
import { Button } from "@saleor/macaw-ui";

/**
 * This is example of using AppBridge, when App is mounted in Dashboard
 * See more about AppBridge possibilities
 * https://github.com/saleor/saleor-app-sdk/blob/main/docs/app-bridge.md
 *
 * You can safely remove this file!
 */

/**
 * As example of communication between App rendered in the dashboard and
 * the App Backend, we'll send empty POST request to protected branch,
 * available at `/api/protected`.
 *
 * Domain and token data can be found in the AppBridgeState.
 */
const SuccessFetchButton = ({
  domain,
  token,
  appBridge,
}: {
  domain: string;
  token: string;
  appBridge: AppBridge;
}) => {
  return (
    <Button
      onClick={() => {
        fetch("/api/protected", {
          method: "POST",
          headers: {
            /**
             * Both domain and token are available in the appBridgeState.
             */
            "saleor-domain": domain,
            "authorization-bearer": token,
          },
        })
          .then((response) => response.json())
          .then((body) => {
            /**
             * We expect this request to succeed, so you should see a toast message
             * with domain
             */
            appBridge?.dispatch({
              type: "notification",
              payload: {
                status: "success",
                title: "You rock!",
                text: JSON.stringify(body),
                actionId: "message-from-app",
              },
            });
          })
          .catch(() =>
            /**
             * If theres issue with connection between UI and App toast will be displayed
             */
            appBridge?.dispatch({
              type: "notification",
              payload: {
                status: "error",
                title: "Unexpected error occurred.",
                text: "Check network tab in your browser and check server logs.",
                actionId: "message-from-app",
              },
            })
          );
      }}
    >
      Send valid request to protected route `/api/protected`
    </Button>
  );
};

/**
 * Second button component will send request with invalid token header. We expect it to fail.
 */
const FailedFetchButton = ({ domain, appBridge }: { domain: string; appBridge: AppBridge }) => {
  return (
    <Button
      onClick={() => {
        fetch("/api/protected", {
          method: "POST",
          headers: {
            "saleor-domain": domain,
            // We are trying to trigger validation error, so token is an random string
            "authorization-bearer": "this is not a valid token",
          },
        })
          .then((response) => response.json())
          .then((body) => {
            // We don't expect this to succeed
            appBridge?.dispatch({
              type: "notification",
              payload: {
                status: "success",
                title: "Request succeeded.. but shouldn't",
                text: "This means you are sending data to route without the validation",
                actionId: "message-from-app",
              },
            });
          })
          .catch(() =>
            // As intended - validation rejects the request and user should see an error toast message
            appBridge?.dispatch({
              type: "notification",
              payload: {
                status: "error",
                title: "Request rejected",
                text: "Everything according to the plan - this request had invalid token",
                actionId: "message-from-app",
              },
            })
          );
      }}
    >
      Trigger rejected response from route `/api/protected`
    </Button>
  );
};

export const DashboardActions = () => {
  const { appBridge, appBridgeState } = useAppBridge();

  const { domain, token } = appBridgeState || {};

  return (
    <div>
      <h2>App running in dashboard!</h2>
      <div
        style={{
          display: "inline-grid",
          gridGap: "2rem",
          gridTemplateColumns: "50% 50%",
        }}
      >
        <Button
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
        <Button
          onClick={() => {
            appBridge?.dispatch({
              type: "redirect",
              payload: {
                to: "/orders",
                actionId: "message-from-app",
              },
            });
          }}
        >
          Redirect to orders ➡️💰
        </Button>
        {domain && token && appBridge && (
          <SuccessFetchButton domain={domain} token={token} appBridge={appBridge} />
        )}
        {domain && appBridge && <FailedFetchButton domain={domain} appBridge={appBridge} />}
      </div>
    </div>
  );
};

/**
 * Export default for Next.dynamic
 */
export default DashboardActions;
