import { createClient } from "./graphql";

export const saleorApiClient = (saleorDomain: string, token: string) =>
  createClient(`https://${saleorDomain}/graphql/`, async () => Promise.resolve({ token }));
