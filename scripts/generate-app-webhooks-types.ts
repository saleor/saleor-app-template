import { writeFileSync } from "node:fs";

import { compile } from "json-schema-to-typescript";

const schemaUrl =
  "https://raw.githubusercontent.com/saleor/saleor/main/saleor/json_schemas/OrderFilterShippingMethods.json";

async function main() {
  const gitHubResponse = await fetch(schemaUrl);
  const fetchedSchema = await gitHubResponse.json();

  const compiledTypes = await compile(fetchedSchema, "OrderFilterShippingMethodsSchema", {
    additionalProperties: false,
  });

  writeFileSync("./generated/json-schema/order-filter-shipping-methods.ts", compiledTypes);
}

try {
  console.log("Fetching JSON schemas from Saleor GitHub repository...");
  await main();
  console.log("Successfully generated TypeScript files from JSON schemas.");
} catch (error) {
  console.error(`Error generating webhook response types: ${error}`);
  process.exit(1);
}
