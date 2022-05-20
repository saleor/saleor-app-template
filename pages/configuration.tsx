import type { NextPage } from "next";
import { useEffect, useState, ChangeEvent, SyntheticEvent } from "react";
import { Card, CardHeader, CardContent, TextField } from "@material-ui/core";
import { ConfirmButton, ConfirmButtonTransitionState, makeStyles } from "@saleor/macaw-ui";

import { SALEOR_DOMAIN_HEADER } from "../constants";
import useApp from "../hooks/useApp";

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

const Configuration: NextPage = () => {
  const classes = useStyles();
  const appState = useApp()?.getState();
  const [configuration, setConfiguration] = useState<ConfigurationField[]>();
  const [transitionState, setTransitionState] = useState<ConfirmButtonTransitionState>("default");

  useEffect(() => {
    appState?.domain && appState?.token && fetch(
        "/api/configuration",
        { headers: [
          [SALEOR_DOMAIN_HEADER, appState.domain],
          ["authorization-bearer", appState.token!],
        ] },
      )
        .then((res) => res.json())
        .then(({ data }) => setConfiguration(data))
  }, [appState]);

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    setTransitionState("loading");

    fetch(
      "/api/configuration",
      {
        method: "POST",
        headers: [
          ["content-type", "application/json"],
          [SALEOR_DOMAIN_HEADER, appState?.domain!],
          ["authorization-bearer", appState?.token!],
        ],
        body: JSON.stringify({ data: configuration }),
      },
    ).then(
      (response) => setTransitionState(response.status === 200 ? "success": "error")
    ).catch(
      () => setTransitionState("error")
    );
  };;

  const onChange = (event: ChangeEvent) => {
    const { name, value } = event.target as HTMLInputElement;
    setConfiguration((prev) =>
      prev!.map((prevField) =>
        prevField.key === name ? { ...prevField, value } : prevField
      )
    );
  };

  if (!appState?.ready || configuration === undefined) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <Card>
      <CardHeader title="Configuration" />
      <CardContent>
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
      </CardContent>
    </Card>
  );
};

export default Configuration;
