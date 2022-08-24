import { APL, AuthData } from "../sdk/types/apl";
import prisma from "./prisma";

export const prismaAPL: APL = {
  get: async (domain) => {
    const authData = await prisma.appRegistration.findFirst({
      where: { domain },
    });
    if (!authData?.domain || !authData?.token) {
      return undefined;
    }
    return {
      token: authData.token,
      domain: authData.domain,
    };
  },
  set: async (authData: AuthData) => {
    // Update or create auth data for the given domain
    await prisma.appRegistration.upsert({
      where: {
        domain: authData.domain,
      },
      update: {
        token: authData.token,
      },
      create: {
        ...authData,
      },
    });
  },
  delete: async (domain: string) => {
    await prisma.appRegistration.delete({
      where: { domain },
    });
  },
  list: async () => {
    const authData = await prisma.appRegistration.findMany();

    return authData.map((data) => ({ token: data.token, domain: data.domain }));
  },
};
