import { NextPage } from "next";
import { useAppBridge } from "@saleor/app-sdk/app-bridge";
import { ConfirmButton, ConfirmButtonTransitionState, makeStyles } from "@saleor/macaw-ui";
import { SyntheticEvent, useEffect, useState } from "react";
import Link from "next/link";
import TextField from "@material-ui/core/TextField";
import { SALEOR_AUTHORIZATION_BEARER_HEADER, SALEOR_DOMAIN_HEADER } from "@saleor/app-sdk/const";
import { SettingsApiResponse, SettingsUpdateApiRequest } from "./api/settings";

const useStyles = makeStyles((theme) => ({
  confirmButton: {
    marginLeft: "auto",
  },
  fieldContainer: {
    marginBottom: theme.spacing(2),
  },
}));

const MetadataManagerPage: NextPage = () => {
  const { appBridgeState, appBridge } = useAppBridge();

  // Use MakawUI styles to maintain consistency with the rest of the dashboard
  const classes = useStyles();

  // Transition state is used to visualize submit button state and block form when requests are in-flight
  const [transitionState, setTransitionState] = useState<ConfirmButtonTransitionState>("loading");

  // State management for two values which will be kept in the metadata
  const [name, setName] = useState<string>("");
  const [secret, setSecret] = useState<string>("");

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    setTransitionState("loading");

    const newSettings: SettingsUpdateApiRequest = { name, secret };

    fetch("/api/settings", {
      method: "POST",
      headers: [
        ["content-type", "application/json"],
        [SALEOR_DOMAIN_HEADER, appBridgeState?.domain!],
        [SALEOR_AUTHORIZATION_BEARER_HEADER, appBridgeState?.token!],
      ],
      body: JSON.stringify(newSettings),
    })
      .then(async (response) => {
        if (response.status === 200) {
          setTransitionState("success");
          const { data } = (await response.json()) as SettingsApiResponse;
          if (data?.name && data.secret) {
            setName(data.name);
            setSecret(data.secret);
          }

          // Use the dashboard notification system to show status of the operation
          appBridge?.dispatch({
            type: "notification",
            payload: {
              status: "success",
              title: "Success",
              text: "Settings updated successfully",
              actionId: "submit-success",
            },
          });
        } else {
          setTransitionState("error");
          appBridge?.dispatch({
            type: "notification",
            payload: {
              status: "error",
              title: "Error",
              text: `Updating the settings unsuccessful. The API responded with status ${response.status}`,
              actionId: "submit-success",
            },
          });
        }
      })
      .catch(async () => {
        setTransitionState("error");
        appBridge?.dispatch({
          type: "notification",
          payload: {
            status: "error",
            title: "Configuration update failed",
            actionId: "submit-error",
          },
        });
      });
  };

  // Fetch and fill the form with values already stored in the metadata.
  // Request will be dispatched one time, once AppBridge is ready.
  useEffect(() => {
    setTransitionState("loading");
    fetch("/api/settings", {
      method: "GET",
      headers: [
        ["content-type", "application/json"],
        [SALEOR_DOMAIN_HEADER, appBridgeState?.domain!],
        [SALEOR_AUTHORIZATION_BEARER_HEADER, appBridgeState?.token!],
      ],
    }).then(async (response) => {
      setTransitionState("default");
      const { data } = (await response.json()) as SettingsApiResponse;
      if (data?.name && data.secret) {
        setName(data.name);
        setSecret(data.secret);
      }
    });
  }, [appBridgeState?.token, appBridgeState?.domain]);

  return (
    <div>
      <h1>Metadata Manager Example ⚙️</h1>
      <p>
        <Link href={"/"}>⬅️ go back</Link>
      </p>
      <p>
        You can use Encrypted Metadata Managers to store configuration of your app. First field
        store plaintext value for key &quot;name&quot;. The second one is obfuscated before sending
        it to the client.
      </p>
      <h2>Example form</h2>

      {appBridgeState?.ready ? (
        <form onSubmit={handleSubmit}>
          <div className={classes.fieldContainer}>
            <TextField
              label={"Name"}
              name={"name"}
              onChange={(e) => {
                setName(e.target.value);
              }}
              fullWidth
              value={name}
              disabled={transitionState === "loading"}
            />
          </div>
          <div className={classes.fieldContainer}>
            <TextField
              label={"Secret"}
              name={"secret"}
              onChange={(e) => {
                setSecret(e.target.value);
              }}
              fullWidth
              value={secret}
              disabled={transitionState === "loading"}
            />
          </div>
          <div>
            <ConfirmButton
              type="submit"
              variant="primary"
              transitionState={transitionState}
              labels={{
                confirm: "Save",
                error: "Error",
              }}
              className={classes.confirmButton}
            />
          </div>
        </form>
      ) : (
        <p>Install this app in your Dashboard and check extra powers!</p>
      )}
    </div>
  );
};

export default MetadataManagerPage;
