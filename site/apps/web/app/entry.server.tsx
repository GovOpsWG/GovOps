import { randomUUID } from "node:crypto";
import { PassThrough } from "node:stream";

import { createReadableStreamFromReadable } from "@react-router/node";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import type { EntryContext, RouterContextProvider } from "react-router";
import { ServerRouter } from "react-router";

import { documentHeaders } from "../security-headers.js";

const STREAM_TIMEOUT_MS = 10_000;

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
  _loadContext: RouterContextProvider,
): Promise<Response> {
  // One nonce per response, stamped onto every script by `<ServerRouter nonce>` and onto the
  // policy below, so the two cannot drift apart.
  const nonce = randomUUID().replaceAll("-", "");
  const waitForAll = isbot(request.headers.get("user-agent") ?? "");

  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let statusCode = responseStatusCode;

    const { pipe, abort } = renderToPipeableStream(
      <ServerRouter context={routerContext} url={request.url} nonce={nonce} />,
      {
        nonce,
        [waitForAll ? "onAllReady" : "onShellReady"]() {
          shellRendered = true;
          const body = new PassThrough();

          responseHeaders.set("Content-Type", "text/html; charset=utf-8");
          for (const [header, value] of Object.entries(documentHeaders(nonce))) {
            responseHeaders.set(header, value);
          }

          resolve(
            new Response(createReadableStreamFromReadable(body), {
              headers: responseHeaders,
              status: statusCode,
            }),
          );
          pipe(body);
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          statusCode = 500;
          // Errors thrown before the shell is sent are surfaced by onShellError instead.
          if (shellRendered) console.error(error);
        },
      },
    );

    setTimeout(abort, STREAM_TIMEOUT_MS);
  });
}
