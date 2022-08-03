import { getEnvVars, setEnvVars } from "./environment";
import { createClient } from "./graphql";
import prisma from "./prisma";

export interface Configuration {
  domain: string;
  token: string;
}

const MT_MODE = true;

export const getConfiguration = async (domain: string) => {
  if (MT_MODE) {
    const registration = await prisma.appRegistration.findFirst({
      where: { domain },
    });
    if (!registration) {
      throw new Error(`Domain ${domain} not registered`);
    }
    return registration;
  } else {
    const env = await getEnvVars();
    if (domain !== env.SALEOR_DOMAIN) {
      throw new Error(`Domain ${domain} not registered`);
    }
    return {
      token: env.SALEOR_AUTH_TOKEN,
      domain: env.SALEOR_DOMAIN,
    };
  }
};

export const setConfiguration = async (configuration: Configuration) => {
  if (MT_MODE) {
    await prisma.appRegistration.create({
      data: configuration,
    });
  } else {
    await setEnvVars([
      {
        key: "SALEOR_AUTH_TOKEN",
        value: configuration.token,
      },
      {
        key: "SALEOR_DOMAIN",
        value: configuration.domain,
      },
    ]);
  }
};

export const saleorApiClient = (saleorDomain: string) => {
  return createClient(`https://${saleorDomain}/graphql/`, async () =>
    Promise.resolve({ token: (await getConfiguration(saleorDomain))?.token })
  );
};
