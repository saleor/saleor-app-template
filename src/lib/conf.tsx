import validator from "@rjsf/validator-ajv8";
import Form from "@rjsf/material-ui";

import { RJSFSchema } from "@rjsf/utils";
import { Card } from "@material-ui/core";
import { NextApiRequest, NextApiResponse } from "next";
import { MetadataManager } from "@saleor/app-sdk/settings-manager";
import { fetchAllMetadata, mutateMetadata } from "./metadata";
import { SALEOR_DOMAIN_HEADER } from "@saleor/app-sdk/const";
import { saleorApp } from "../../saleor-app";
import { createClient } from "./graphql";
import { useState } from "react";

const schema: RJSFSchema = {
  title: "Algolia configuration",
  description: "API keys section",
  type: "object",
  required: ["appId", "adminKey", "searchKey"],
  additionalProperties: false, // has to be added to prevent saving unrelated data
  properties: {
    appId: {
      type: "string",
      title: "APP ID",
    },
    adminKey: {
      type: "string",
      title: "Admin key",
    },
    searchKey: {
      type: "string",
      title: "Search key",
    },
  },
};

const validateIncomingData = (data: unknown) => {
  return validator.validateFormData(data, schema);
};

export const ConfigurationFormComponent: React.FC = () => {
  const [formData, setFormData] = useState(null);

  return (
    <Card style={{ padding: "30px 30px 30px 30px" }}>
      <Form
        schema={schema}
        validator={validator}
        formData={formData}
        onChange={(e) => setFormData(e.formData)}
        onSubmit={(x) =>
          fetch("/api/configuration", { method: "POST", body: JSON.stringify(x.formData) })
        }
        // onError={log("errors")}
      />
    </Card>
  );
};

export const confHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const saleorDomain = req.headers[SALEOR_DOMAIN_HEADER] as string;
  const authData = await saleorApp.apl.get(saleorDomain);
  if (!authData) {
    console.debug(`Could not find auth data for the domain ${saleorDomain}.`);
    res.status(401).end();
    return;
  }
  const client = createClient(`https://${saleorDomain}/graphql/`, async () =>
    Promise.resolve({ token: authData.token })
  );

  const settings = new MetadataManager({
    fetchMetadata: () => fetchAllMetadata(client),
    mutateMetadata: (md) => mutateMetadata(client, md),
  });

  if (req.method === "POST") {
    const formData = JSON.parse(req.body);
    const validationResult = validateIncomingData(formData);
    if (validationResult.errors.length > 0) {
      console.log("Received wrong data:", validationResult);
      res.status(400).json(validationResult);
      return;
    }
    // TODO: saving the metadata
  }
  if (req.method === "GET") {
    console.log(schema.properties);
  }

  res.json("all clar");
};
