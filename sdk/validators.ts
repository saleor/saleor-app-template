// import { getSaleorHeaders } from "@saleor/app-sdk/headers";
import { IncomingHttpHeaders } from "http";

import { APL } from "./types/apl";

export const validateWebhookHeaders = async (headers: IncomingHttpHeaders) =>
  // todo: fix export of the headers helper in the SDK
  // const saleorHeaders = getSaleorHeaders(headers);
  // if (!saleorHeaders.domain) {
  //   return {
  //     status: 400,
  //     message: "Missing Saleor domain header.",
  //   };
  // }
  // if (!saleorHeaders.event) {
  //   return {
  //     status: 400,
  //     message: "Missing Saleor event header.",
  //   };
  // }
  // if (!saleorHeaders.signature) {
  //   return {
  //     status: 400,
  //     message: "Missing webhook signature header.",
  //   };
  // }
  null;

export const validateExistingRegistration = async (domain: string, apl: APL) => {
  if (!(await apl.get(domain))) {
    return {
      message: `The ${domain} has not been registered yet.`,
      status: 401,
    };
  }
  return null;
};

export const validateMethod = async (method: string, expectedMethod: string) => {
  if (method !== expectedMethod) {
    return {
      message: `Wrong webhook request method. ${method} instead of ${expectedMethod}.`,
      status: 405,
    };
  }
  return null;
};
