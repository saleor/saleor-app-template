import type { FromSchema } from "json-schema-to-ts";
import { JSONConfiguration } from "./JSONConfiguration";

export const exampleSchema = {
  type: "object",
  additionalProperties: false,
  definitions: {
    algolia_configuration: {
      type: "object",
      properties: {
        appId: {
          type: "number",
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
    },
    typesense_configuration: {
      type: "object",
      properties: {
        username: {
          type: "string",
          title: "Username",
        },
        adminKey: {
          type: "string",
          title: "Admin key",
        },
      },
    },
    app_configuration: {
      type: "object",
      properties: {
        isActive: {
          type: "boolean",
          title: "Is application active",
        },
        channels: {
          type: "array",
          description:
            "Array fields use more complicated widget. Click on the plus to add a new value.",
          items: {
            type: "string",
          },
        },
      },
    },
  },
  properties: {
    algolia: {
      $ref: "#/definitions/algolia_configuration",
      title: "Algolia configuration",
      description: "Configuration keys can be found in your Algolia Dashboard",
    },
    typesense: {
      $ref: "#/definitions/typesense_configuration",
      title: "Typesense configuration",
      description: "Here is another message describing fields below",
    },
    app_configuration: { $ref: "#/definitions/app_configuration", title: "Application behavior" },
  },
} as const;

export type SchemaType = FromSchema<typeof exampleSchema>;

export const exampleJSONConfiguration = new JSONConfiguration({
  name: "Example Configuration",
  schema: exampleSchema,
  apiPath: "/api/configuration",
});
