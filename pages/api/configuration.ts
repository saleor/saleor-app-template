import { toNextHandler } from "retes/adapter";
import type { Handler } from "retes";
import { Response } from "retes/response";

import { createClient } from "../../lib/graphql";
import { withJWTVerified } from "../../lib/middlewares";
import { getEnvVars } from "../../lib/environment";
import {
  FetchAppDetailsDocument,
  UpdateAppMetadataDocument,
  MetadataItem,
  MetadataInput,
} from "../../generated/graphql";
import { withSaleorDomainMatch } from "../../lib/middlewares";
import { SALEOR_DOMAIN_HEADER } from "@saleor/app-sdk/const";

const CONFIGURATION_KEYS = ["NUMBER_OF_ORDERS"];

const prepareMetadataFromRequest = (input: MetadataInput[] | MetadataItem[]) =>
  input
    .filter(({ key }) => CONFIGURATION_KEYS.includes(key))
    .map(({ key, value }) => ({ key, value }));

const prepareResponseFromMetadata = (input: MetadataItem[]) => {
  const output: MetadataInput[] = [];
  for (const configurationKey of CONFIGURATION_KEYS) {
    output.push(
      input.find(({ key }) => key === configurationKey) ?? {
        key: configurationKey,
        value: "",
      }
    );
  }
  return output.map(({ key, value }) => ({ key, value }));
};

const handler: Handler = async (request) => {
  const saleorDomain = request.headers[SALEOR_DOMAIN_HEADER];

  const client = createClient(`https://${saleorDomain}/graphql/`, async () =>
    Promise.resolve({ token: (await getEnvVars()).SALEOR_AUTH_TOKEN })
  );

  let privateMetadata;
  switch (request.method!) {
    case "GET":
      privateMetadata = (
        await client
          .query(FetchAppDetailsDocument)
          .toPromise()
      ).data?.app?.privateMetadata!;

      return Response.OK({
        success: true,
        data: prepareResponseFromMetadata(privateMetadata),
      });
    case "POST":
      const appId = (
        await client
          .query(FetchAppDetailsDocument)
          .toPromise()
      ).data?.app?.id;

      privateMetadata = (
        await client
          .mutation(UpdateAppMetadataDocument, {
            id: appId as string,
            input: prepareMetadataFromRequest((request.body as any).data),
          })
          .toPromise()
      ).data?.updatePrivateMetadata?.item?.privateMetadata!;

      return Response.OK({
        success: true,
        data: prepareResponseFromMetadata(privateMetadata),
      });
    default:
      return Response.MethodNotAllowed();
  }
};

export default toNextHandler([
  withSaleorDomainMatch,
  withJWTVerified,
  handler,
]);
