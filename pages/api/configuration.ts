import { NextApiHandler } from "next";

import { createClient } from "../../lib/graphql";
import { domainMiddleware, jwtVerifyMiddleware } from "../../lib/middlewares";
import MiddlewareError from "../../utils/MiddlewareError";
import { getAuthToken } from "../../lib/environment";
import {
  FetchAppMetadataDocument,
  FetchAppMetadataQuery,
  UpdateAppMetadataDocument,
  UpdateAppMetadataMutation,
  MetadataItem,
  MetadataInput,
} from "../../generated/graphql";

const CONFIGURATION_KEYS = [
  "NUMBER_OF_ORDERS",
];

const prepareMetadataFromRequest = (input: MetadataInput[] | MetadataItem[]) =>
  input
    .filter(({ key }) => CONFIGURATION_KEYS.includes(key))
    .map(({ key, value }) => ({ key, value }));

const prepareResponseFromMetadata = (input: MetadataItem[]) => {
  const output: MetadataInput[] = [];
  for (const configurationKey of CONFIGURATION_KEYS) {
    output.push(
      input.find(({ key }) => key === configurationKey) ?? { key: configurationKey, value: "" }
    );
  }
  return output.map(({ key, value }) => ({ key, value }));
};

const handler: NextApiHandler = async (request, response) => {
  let saleorDomain: string;

  try {
    saleorDomain = domainMiddleware(request) as string;
    await jwtVerifyMiddleware(request);
  }
  catch (e: unknown) {
    const error = e as MiddlewareError;

    console.error(error);
    response
      .status(error.statusCode)
      .json({ success: false, message: error.message });
    return;
  }

  const client = createClient(
    `https://${saleorDomain}/graphql/`,
    async () => Promise.resolve({ token: getAuthToken() }),
  );

  let privateMetadata;
  switch (request.method!) {
    case "GET":
      privateMetadata  = (
        (await client.query<FetchAppMetadataQuery>(FetchAppMetadataDocument).toPromise()).data
      )?.app?.privateMetadata!;

      response.json({ success: true, data: prepareResponseFromMetadata(privateMetadata) });
      break;
    case "POST":
      const appId = (
        (await client.query<FetchAppMetadataQuery>(FetchAppMetadataDocument).toPromise()).data
      )?.app?.id;

      privateMetadata = (
        (await client.mutation<UpdateAppMetadataMutation>(
          UpdateAppMetadataDocument,
          { id: appId, input: prepareMetadataFromRequest(request.body.data) }
        ).toPromise()).data
      )?.updatePrivateMetadata?.item?.privateMetadata!;

      response.json({ success: true, data: prepareResponseFromMetadata(privateMetadata) });
      break;
    default:
      response
        .status(405)
        .json({ success: false, message: "Method not allowed." });
  }
};

export default handler;
