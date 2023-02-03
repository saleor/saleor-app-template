import { NextPage } from "next";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { Button, makeStyles } from "@saleor/macaw-ui";
import { GitHub, OfflineBoltOutlined } from "@material-ui/icons";
import { actions, useAppBridge } from "@saleor/app-sdk/app-bridge";
import { Typography } from "@material-ui/core";
import { MainBar } from "../modules/ui/main-bar";
import { trpcClient } from "../modules/trpc/trpc-client";
import { ChannelsConfiguration } from "../modules/app-configuration/ui/channels-configuration";
import { appBrandColor, appName } from "../const";

const useStyles = makeStyles({
  buttonsGrid: { display: "flex", gap: 10 },
  topBar: {
    marginBottom: 32,
  },
  appIconContainer: {
    background: appBrandColor,
    padding: 10,
    borderRadius: "50%",
    width: 50,
    height: 50,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
  },
});

const AppIcon = () => {
  const styles = useStyles();

  return (
    <div className={styles.appIconContainer}>
      {/* TODO: If the application has custom icon, put it here */}
      <Typography variant="h2">{appName.charAt(0)}</Typography>
    </div>
  );
};

const ConfigurationPage: NextPage = () => {
  const styles = useStyles();
  const channels = trpcClient.channels.fetch.useQuery();
  const router = useRouter();

  const { appBridge } = useAppBridge();

  const openInNewTab = (url: string) => {
    appBridge?.dispatch(
      actions.Redirect({
        to: url,
        newContext: true,
      })
    );
  };

  useEffect(() => {
    if (channels.isSuccess && channels.data.length === 0) {
      router.push("/not-ready");
    }
  }, [channels.data, channels.isSuccess]);

  return (
    <div>
      <MainBar
        icon={<AppIcon />}
        className={styles.topBar}
        name={appName}
        author="By Saleor Commerce"
        rightColumnContent={
          <div className={styles.buttonsGrid}>
            <Button
              variant="secondary"
              startIcon={<GitHub />}
              onClick={() => {
                // TODO: update the repository URL
                openInNewTab("https://github.com/saleor/saleor-APP_NAME");
              }}
            >
              Repository
            </Button>
            <Button
              startIcon={<OfflineBoltOutlined />}
              variant="secondary"
              onClick={() => {
                openInNewTab("https://github.com/saleor/apps/discussions");
              }}
            >
              Request a feature
            </Button>
          </div>
        }
      />
      <ChannelsConfiguration />
    </div>
  );
};

export default ConfigurationPage;
