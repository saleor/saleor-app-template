import validator from "@rjsf/validator-ajv8";

import { NextApiRequest, NextApiResponse } from "next";
import { MetadataManager } from "@saleor/app-sdk/settings-manager";
import { fetchAllMetadata, mutateMetadata } from "./metadata";
import { createClient } from "./graphql";
import { createProtectedHandler, ProtectedHandlerContext } from "@saleor/app-sdk/handlers/next";
import { RJSFSchema } from "@rjsf/utils";
import { APL } from "@saleor/app-sdk/APL";

export interface ConfigurationHandlerFactoryProperties {
  name: string;
  schema: RJSFSchema;
}

export const configurationHandlerFactory = (props: ConfigurationHandlerFactoryProperties) => {
  return async (req: NextApiRequest, res: NextApiResponse, ctx: ProtectedHandlerContext) => {
    const { authData } = ctx;
    console.log("Configuration handler factory");

    const client = createClient(`https://${authData.domain}/graphql/`, async () =>
      Promise.resolve({ token: authData.token })
    );

    // todo: Settings manager should be passed as argument
    const settings = new MetadataManager({
      fetchMetadata: () => fetchAllMetadata(client),
      mutateMetadata: (md) => mutateMetadata(client, md),
    });

    if (req.method === "POST") {
      const formData = JSON.parse(req.body);
      const validationResult = validator.validateFormData(formData, props.schema);
      if (validationResult.errors.length > 0) {
        console.log("Received wrong data:", validationResult);
        res.status(400).json(validationResult);
        return;
      }
      await settings.set({ key: props.name, value: JSON.stringify(formData) });
      res.status(200).json(formData);
      return;
    }
    if (req.method === "GET") {
      const savedData = await settings.get(props.name);
      if (!savedData) {
        res.status(200).json({});
        return;
      }
      res.status(200).json(JSON.parse(savedData));
      return;
    }
  };
};

export type JSONConfigurationProps = {
  name: string;
  schema: RJSFSchema;
  apiPath: string;
};

export class JSONConfiguration {
  name: string;
  schema: RJSFSchema;
  apiPath: string;

  constructor(props: JSONConfigurationProps) {
    this.name = props.name;
    this.schema = props.schema;
    this.apiPath = props.apiPath;
  }

  createHandler(apl: APL) {
    return createProtectedHandler(
      configurationHandlerFactory({
        name: this.name,
        schema: this.schema,
      }),
      apl
    );
  }

  // todo: add methods which set/get configuration. Use SettingsManager as argument
}
