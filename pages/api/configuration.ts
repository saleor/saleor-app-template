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
} from "../../generated/graphql";

const CONFIGURATION_KEYS = [
  "THAT_SECRET",
  "THIS_VALUE",
];

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
        (await client.query(FetchAppMetadataDocument).toPromise()).data as FetchAppMetadataQuery
      )?.app?.privateMetadata!;

      response.json({
        success: true,
        data: privateMetadata
          .filter(({ key }) => CONFIGURATION_KEYS.includes(key as string))
          .map(({ key, value }) => ({ key, value }))
      });
      break;
    case "POST":
      const newPrivateMetadata = request.body.data
        .filter(({ key }: { key: string, value: string }) => CONFIGURATION_KEYS.includes(key as string))
        .map(({ key, value }: { key: string, value: string }) => ({ key, value }));

      const appId = (
        (await client.query(FetchAppMetadataDocument).toPromise()).data as FetchAppMetadataQuery
      )?.app?.id;

      privateMetadata = (
        (await client.mutation(
          UpdateAppMetadataDocument,
          { id: appId, input: newPrivateMetadata }
        ).toPromise()).data as UpdateAppMetadataMutation
      )?.updatePrivateMetadata?.item?.privateMetadata!;

      response.json({
        success: true,
        data: privateMetadata
          .filter(({ key }) => CONFIGURATION_KEYS.includes(key))
          .map(({ key, value }) => ({ key, value }))
      });
      break;
    default:
      response
        .status(405)
        .json({ success: false, message: "Method not allowed." });
  }
};

export default handler;
