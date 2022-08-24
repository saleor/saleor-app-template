import { SALEOR_DOMAIN_HEADER } from "@saleor/app-sdk/const";
import { IncomingMessage, ServerResponse } from "http";

import { APL } from "./types/apl";
import { Manifest } from "./types/manifest";
import { ValidationError } from "./types/validators";
import { validateMethod } from "./validators";

// Return response to the client with proper error code and add logging
export const returnErrorResponse = (res: ServerResponse, validationError: ValidationError) => {
  console.error(validationError.message);
  res.statusCode = validationError.status;
  res.end(validationError.message);
};

export const defaultRegisterHandler = async (
  req: IncomingMessage,
  res: ServerResponse,
  apl: APL
) => {
  console.debug("Received a register request.");

  const methodCheck = await validateMethod(req.method!, "POST");
  if (methodCheck) {
    returnErrorResponse(res, methodCheck);
    return;
  }

  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
  });
  req.on("end", () => {
    const registrationData = JSON.parse(data);
    const token = registrationData?.auth_token as string;
    if (!token) {
      res.statusCode = 400;
      res.end("Registration failed: missing auth_token in request body.");
    }

    const domain = req.headers[SALEOR_DOMAIN_HEADER] as string;

    apl
      .set({ domain, token })
      .then(() => {
        res.statusCode = 200;
        res.end(JSON.stringify({ success: true }));
        console.debug("Registration success.");
      })
      .catch((error) => {
        console.debug(error);
        res.statusCode = 500;
        res.end("Registration failed: error during saving the configuration");
        console.error("Registration failed: error during saving the configuration");
      });
  });
  req.on("error", () => {
    res.statusCode = 500;
    res.end();
    console.debug("message receive: fail");
  });
};

export const defaultManifestHandler = async (
  req: IncomingMessage,
  res: ServerResponse,
  manifestFn: (baseUrl: string) => Manifest
) => {
  console.debug("Received a manifest request.");

  const methodErrors = await validateMethod(req.method!, "GET");
  if (methodErrors) {
    returnErrorResponse(res, methodErrors);
    return;
  }

  const { host, "x-forwarded-proto": protocol = "http" } = req.headers;
  const manifest = manifestFn(`${protocol}://${host}`);

  res.statusCode = 200;
  res.end(JSON.stringify(manifest));
};
