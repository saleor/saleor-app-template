import type { Handler } from "retes";

import { Response } from "retes/response";
// import { toNextHandler } from "retes/adapter";
import { withSaleorEventMatch } from "@saleor/app-sdk/middleware";

import {
  withSaleorDomainMatch,
  withWebhookSignatureVerified,
} from "../../../lib/middlewares";

/////////////////////////////////////////////////////////////////////////////////////////////////////////
export const compose =
  <T extends Function>(...functions: T[]) =>
  (args) =>
    functions.reduce((arg, fn) => fn(arg), args);

export function isPipeline(handler: Handler | Pipeline): handler is Pipeline {
  return Array.isArray(handler);
}

export const composePipeline = (pipeline: Pipeline): Handler => {
  const [action, ...middleware] = pipeline.reverse() as ReversedPipeline;
  return compose(...middleware)(action)
}

// TO BE MOVED TO node_modules/retes/src/adapter.ts
import type { NextApiHandler, NextApiRequest } from "next";
import type { HTTPMethod } from "retes";
import type { Pipeline, ReversedPipeline } from "retes/types";

import { IncomingMessage } from "http";
import { parse } from "next/dist/compiled/content-type";
import isError from "next/dist/lib/is-error";
import { ApiError } from "next/dist/server/api-utils";

// THAT'S FROM NEXTJS
function parseJson(str: string): object {
  if (str.length === 0) {
    // special-case empty json body, as it's a common client-side mistake
    return {}
  }

  try {
    return JSON.parse(str)
  } catch (e) {
    throw new ApiError(400, 'Invalid JSON')
  }
}

  export async function parseBody(
    req: IncomingMessage,
    limit: string | number
  ): Promise<{ body: any, rawBody: string }> {
    let contentType
    try {
      contentType = parse(req.headers['content-type'] || 'text/plain')
    } catch {
      contentType = parse('text/plain')
    }
    const { type, parameters } = contentType
    const encoding = parameters.charset || 'utf-8'
  
    let buffer
  
    try {
      const getRawBody =
        require('next/dist/compiled/raw-body') as typeof import('next/dist/compiled/raw-body')
      buffer = await getRawBody(req, { encoding, limit })
    } catch (e) {
      if (isError(e) && e.type === 'entity.too.large') {
        throw new ApiError(413, `Body exceeded ${limit} limit`)
      } else {
        throw new ApiError(400, 'Invalid body')
      }
    }
  
    const rawBody = buffer.toString()

    if (type === 'application/json' || type === 'application/ld+json') {
      return {
        rawBody,
        body: parseJson(rawBody),
      };
    } else if (type === 'application/x-www-form-urlencoded') {
      const qs = require('querystring');
      return {
        rawBody,
        body: qs.decode(rawBody),
      };
    } else {
      return {
        rawBody,
        body: rawBody,
      };
    }
  }  

const fromNextRequest = async (req: NextApiRequest): Request => {
  ////////////////////////////////////
  const limit = "1mb";
  let bodies;
  if (!req.body) {
    bodies = await parseBody(req, "1mb");
  }
  const body = req.body || bodies.body
  ////////////////////////////////////

  const { method, url, headers = {} } = req;
  const { host } = headers;

  const params = Object.assign({}, body); // to fix the `[Object: null prototype]` warning

  const request: Request = {
    params,
    context: {},
    headers,
    host,
    method: method as HTTPMethod,
    url,
    body,
    rawBody: bodies.rawBody,
    // FIXME
    response: null,
  };

  return request;
};

export const toNextHandler = (flow: Handler | Pipeline): NextApiHandler => {
  // FIXME handle empty array
  // FIXME handle one element array

  const handler =
    isPipeline(flow) && flow.length > 1
      ? composePipeline(flow)
      : (flow as Handler);

  return async (req, res) => {
    const response = await handler(await fromNextRequest(req));
    const { body, status, headers } = response;

    for (var key in headers) {
      res.setHeader(key, headers[key]);
    }

    res.status(status).send(body);
  };
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////

const handler: Handler = async (request) => {
  //
  // Your logic goes here
  //
  return Response.OK({ success: true });
};

export default toNextHandler([
  withSaleorDomainMatch,
  withSaleorEventMatch("order_created"),
  withWebhookSignatureVerified(),
  handler,
]);

export const config = {
  api: {
    bodyParser: false,
  },
};
