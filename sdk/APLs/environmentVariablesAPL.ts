import { getEnvVars, setEnvVars } from "../dataConnectors/environmentVariables";
import { APL, AuthData } from "../types/apl";

export const environmentVariablesAPL: APL = {
  get: async (domain) => {
    const env = await getEnvVars();
    if (domain !== env.SALEOR_DOMAIN || !env.SALEOR_AUTH_TOKEN) {
      return undefined;
    }
    return {
      token: env.SALEOR_AUTH_TOKEN,
      domain: env.SALEOR_DOMAIN,
    };
  },
  set: async (authData: AuthData) => {
    await setEnvVars([
      {
        key: "SALEOR_AUTH_TOKEN",
        value: authData.token,
      },
      {
        key: "SALEOR_DOMAIN",
        value: authData.domain,
      },
    ]);
  },
  delete: async (domain: string) => {
    const env = await getEnvVars();

    if (domain !== env.SALEOR_DOMAIN) {
      return;
    }
    await setEnvVars([
      {
        key: "SALEOR_AUTH_TOKEN",
        value: "",
      },
      {
        key: "SALEOR_DOMAIN",
        value: "",
      },
    ]);
  },
  list: async () => {
    const env = await getEnvVars();
    if (!env.SALEOR_DOMAIN || !env.SALEOR_AUTH_TOKEN) {
      return [];
    }
    const authData = {
      token: env.SALEOR_AUTH_TOKEN,
      domain: env.SALEOR_DOMAIN,
    };
    return [authData];
  },
};
