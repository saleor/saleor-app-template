import { Card, CardContent, CardHeader, TextField } from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";
import { AplReadyResult, VercelAPL } from "@saleor/app-sdk/APL";
import { useAppBridge, withAuthorization } from "@saleor/app-sdk/app-bridge";
import { SALEOR_AUTHORIZATION_BEARER_HEADER, SALEOR_DOMAIN_HEADER } from "@saleor/app-sdk/const";
import { ConfirmButton, ConfirmButtonTransitionState, makeStyles } from "@saleor/macaw-ui";
import { GetServerSideProps } from "next";
import { ChangeEvent, ReactElement, SyntheticEvent, useEffect, useState } from "react";

import AccessWarning from "../components/AccessWarning/AccessWarning";
import { ConfigurationError } from "../components/ConfigurationError/ConfigurationError";
import useAppApi from "../hooks/useAppApi";
import { saleorApp } from "../saleor-app";
import useDashboardNotifier from "../utils/useDashboardNotifier";

interface ConfigurationField {
  label: string;
  key: string;
  value: string;
}

const useStyles = makeStyles((theme) => ({
  confirmButton: {
    marginLeft: "auto",
  },
  fieldContainer: {
    marginBottom: theme.spacing(2),
  },
}));

type PageProps = {
  isVercel: boolean;
  appReady: AplReadyResult;
};

export const getServerSideProps: GetServerSideProps<PageProps> = async () => {
  const isVercel = saleorApp.apl instanceof VercelAPL;
  const isAppReady = await saleorApp.isReady();

  return {
    props: {
      isVercel,
      appReady: isAppReady,
    },
  };
};

function Configuration({ isVercel, appReady }: PageProps) {
  const classes = useStyles();
  const { appBridgeState } = useAppBridge();
  const [notify] = useDashboardNotifier();
  const [configuration, setConfiguration] = useState<ConfigurationField[]>([]);
  const [transitionState, setTransitionState] = useState<ConfirmButtonTransitionState>("default");

  const {
    data: configurationQuery,
    error,
    loading,
  } = useAppApi<{ data: ConfigurationField[] }>({
    url: "/api/configuration",
  });

  useEffect(() => {
    if (!loading) {
      setConfiguration(configurationQuery?.data || []);
    }
  }, [JSON.stringify(configurationQuery), loading]);

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    setTransitionState("loading");

    fetch("/api/configuration", {
      method: "POST",
      headers: [
        ["content-type", "application/json"],
        [SALEOR_DOMAIN_HEADER, appBridgeState?.domain!],
        [SALEOR_AUTHORIZATION_BEARER_HEADER, appBridgeState?.token!],
      ],
      body: JSON.stringify({
        data: configuration?.map((field) => ({ key: field.key, value: field.value })),
      }),
    })
      .then(async (response) => {
        setTransitionState(response.status === 200 ? "success" : "error");
        await notify({
          status: "success",
          title: "Success",
          text: "Configuration updated successfully",
        });
      })
      .catch(async () => {
        setTransitionState("error");
        await notify({
          status: "error",
          title: "Configuration update failed",
        });
      });
  };

  const onChange = (event: ChangeEvent) => {
    const { name, value } = event.target as HTMLInputElement;
    setConfiguration((prev) =>
      prev!.map((prevField) => (prevField.key === name ? { ...prevField, value } : prevField))
    );
  };

  if (error) {
    console.error("Can't establish connection with the App API: ", error);
    return <ConfigurationError appReady={appReady} isVercel={isVercel} />;
  }

  if (loading) {
    return <Skeleton />;
  }

  return (
    <form onSubmit={handleSubmit}>
      {configuration.map(({ label, key, value }) => (
        <div key={key} className={classes.fieldContainer}>
          <TextField label={label} name={key} fullWidth onChange={onChange} value={value} />
        </div>
      ))}
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
  );
}

Configuration.getLayout = (page: ReactElement) => (
  <Card>
    <CardHeader title="Configuration" />
    <CardContent>{page}</CardContent>
  </Card>
);

export default withAuthorization({
  notIframe: <AccessWarning cause="not_in_iframe" />,
  unmounted: null,
  noDashboardToken: <AccessWarning cause="missing_access_token" />,
  dashboardTokenInvalid: <AccessWarning cause="invalid_access_token" />,
})(Configuration);
