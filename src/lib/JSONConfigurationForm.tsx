import { Card } from "@material-ui/core";
import { useState } from "react";
import Form from "@rjsf/material-ui";
import validator from "@rjsf/validator-ajv8";
import { useAppBridge } from "@saleor/app-sdk/app-bridge";
import { useQuery } from "@tanstack/react-query";
import { JSONConfiguration } from "./JSONConfiguration";

export const fetchConfiguration = async (url: string, domain: string, token: string) => {
  const res = await fetch(url, {
    headers: {
      "authorization-bearer": token,
      "saleor-domain": domain,
    },
  });
  const data = await res.json();
  return data;
};

interface JSONConfigurationFormProps {
  JSONConf: JSONConfiguration;
}

export const JSONConfigurationForm: React.FC<JSONConfigurationFormProps> = ({ JSONConf }) => {
  const [formData, setFormData] = useState(undefined);
  const [extraErrors, setExtraErrors] = useState(undefined);
  const { appBridgeState, appBridge } = useAppBridge();
  const domain = appBridgeState?.domain;
  const token = appBridgeState?.token;

  const { isLoading: isQueryLoading } = useQuery({
    queryKey: ["configuration"],
    onSuccess(data) {
      setFormData(data);
    },
    queryFn: async () => fetchConfiguration(JSONConf.apiPath, domain!, token!),
    enabled: !!token && !!domain,
  });

  const isLoading = isQueryLoading && !appBridgeState?.ready;

  return (
    <Card style={{ padding: "30px 30px 30px 30px" }}>
      {!isLoading ? (
        <Form
          schema={JSONConf.schema}
          validator={validator}
          formData={formData}
          extraErrors={extraErrors}
          onChange={(e) => {
            setFormData(e.formData);
          }}
          onSubmit={(x) =>
            fetch(JSONConf.apiPath, {
              method: "POST",
              body: JSON.stringify(x.formData),
              headers: {
                "saleor-domain": domain!,
                "authorization-bearer": token!,
              },
            })
              .then((res) => res.json())
              .then((responseBody) => {
                if (responseBody?.errorSchema) {
                  setExtraErrors(responseBody.errorSchema);
                  appBridge?.dispatch({
                    type: "notification",
                    payload: {
                      status: "error",
                      title: "Couldn't save the configuration",
                      actionId: "message-from-app",
                    },
                  });
                } else {
                  setExtraErrors(undefined);
                  appBridge?.dispatch({
                    type: "notification",
                    payload: {
                      status: "success",
                      title: "Changes saved",
                      actionId: "message-from-app",
                    },
                  });
                }
              })
          }
        />
      ) : (
        <p>Loading...</p>
      )}
    </Card>
  );
};
