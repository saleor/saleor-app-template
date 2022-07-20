import type { NextPage } from "next";
import { useEffect, useState, ChangeEvent, SyntheticEvent } from "react";
import { Card, CardHeader, CardContent, TextField } from "@material-ui/core";
import {
  ConfirmButton,
  ConfirmButtonTransitionState,
  makeStyles,
} from "@saleor/macaw-ui";

import { SALEOR_DOMAIN_HEADER } from "@saleor/app-sdk/const";
import useApp from "../hooks/useApp";
import useAppApi from "../hooks/useAppApi";
import { Skeleton } from "@material-ui/lab";
import { PageWithLayout } from "../types";

interface ConfigurationField {
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

const Configuration: PageWithLayout = () => {
  const classes = useStyles();
  const appState = useApp()?.getState();
  const [configuration, setConfiguration] = useState<ConfigurationField[]>();
  const [transitionState, setTransitionState] =
    useState<ConfirmButtonTransitionState>("default");

  const { data: configurationData, error } = useAppApi({
    url: "/api/configuration",
  });

  useEffect(() => {
    if (configurationData && !configuration) {
      setConfiguration(configurationData.data);
    }
  }, [configurationData, configuration]);

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    setTransitionState("loading");

    fetch("/api/configuration", {
      method: "POST",
      headers: [
        ["content-type", "application/json"],
        [SALEOR_DOMAIN_HEADER, appState?.domain!],
        ["authorization-bearer", appState?.token!],
      ],
      body: JSON.stringify({ data: configuration }),
    })
      .then((response) =>
        setTransitionState(response.status === 200 ? "success" : "error")
      )
      .catch(() => setTransitionState("error"));
  };

  const onChange = (event: ChangeEvent) => {
    const { name, value } = event.target as HTMLInputElement;
    setConfiguration((prev) =>
      prev!.map((prevField) =>
        prevField.key === name ? { ...prevField, value } : prevField
      )
    );
  };

  const hasError = !!error;

  // TODO
  // We should show errors using Dashboard's hook 'useNotifier'
  // This logic has to be yet implemented in app-bridge
  if (hasError) {
    return <div>{error as string}</div>;
  }

  if (configuration === undefined) {
    return <Skeleton />;
  }

  return (
    <form onSubmit={handleSubmit}>
      {configuration!.map(({ key, value }) => (
        <div key={key} className={classes.fieldContainer}>
          <TextField
            label={key}
            name={key}
            fullWidth
            onChange={onChange}
            value={value}
          />
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
};

Configuration.getLayout = (page) => (
  <Card>
    <CardHeader title="Configuration" />
    <CardContent>{page}</CardContent>
  </Card>
);

export default Configuration;
