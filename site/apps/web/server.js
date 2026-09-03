import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize, resolve, sep } from "node:path";
import { pipeline } from "node:stream/promises";
import { fileURLToPath } from "node:url";

import { createRequestListener } from "@react-router/node";

import { staticAssetHeaders } from "./security-headers.js";

const DEFAULT_PORT = 3000;
const DEFAULT_HOST = "127.0.0.1";
const CLIENT_DIRECTORY = fileURLToPath(new URL("./build/client/", import.meta.url));

const MIME_TYPES = new Map([
  [".css", "text/css; charset=utf-8"],
  [".ico", "image/x-icon"],
  [".jpeg", "image/jpeg"],
  [".jpg", "image/jpeg"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".map", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml; charset=utf-8"],
  [".txt", "text/plain; charset=utf-8"],
  [".webp", "image/webp"],
  [".woff2", "font/woff2"],
  [".xml", "application/xml; charset=utf-8"],
]);

export function parseServerEnvironment(environment) {
  const rawPort = environment.PORT ?? String(DEFAULT_PORT);
  const port = Number(rawPort);
  const host = (environment.HOST ?? DEFAULT_HOST).trim();

  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error(`PORT must be an integer between 1 and 65535; received ${rawPort}`);
  }
  if (!host) throw new Error("HOST must not be empty");

  return { host, port };
}

/** Null when the path escapes the build directory, which is what stops `../` traversal. */
export function resolveStaticFile(urlPath, clientDirectory = CLIENT_DIRECTORY) {
  let decoded;
  try {
    decoded = decodeURIComponent(urlPath);
  } catch {
    return null;
  }
  if (decoded.includes("\0")) return null;
  // `normalize` would clamp this anyway; rejecting outright states the property.
  if (decoded.split("/").includes("..")) return null;

  const root = resolve(clientDirectory);
  const candidate = resolve(join(root, normalize(decoded)));
  return candidate === root || candidate.startsWith(root + sep) ? candidate : null;
}

/** Fingerprinted build assets are immutable; everything else is revalidated. */
export function cacheControlFor(urlPath) {
  return urlPath.startsWith("/assets/")
    ? "public, max-age=31536000, immutable"
    : "public, max-age=0, must-revalidate";
}

export function contentTypeFor(file) {
  return MIME_TYPES.get(extname(file).toLowerCase()) ?? "application/octet-stream";
}

async function serveStatic(request, response) {
  if (request.method !== "GET" && request.method !== "HEAD") return false;

  const urlPath = new URL(request.url, "http://localhost").pathname;
  if (urlPath === "/" || urlPath.endsWith("/")) return false;

  const file = resolveStaticFile(urlPath);
  if (!file) return false;

  let info;
  try {
    info = await stat(file);
  } catch {
    return false;
  }
  if (!info.isFile()) return false;

  response.writeHead(200, {
    ...staticAssetHeaders(),
    "content-type": contentTypeFor(file),
    "content-length": info.size,
    "cache-control": cacheControlFor(urlPath),
  });

  if (request.method === "HEAD") {
    response.end();
    return true;
  }

  await pipeline(createReadStream(file), response);
  return true;
}

const handleRequest = createRequestListener({
  build: () => import("./build/server/index.js"),
});

const server = createServer((request, response) => {
  serveStatic(request, response)
    .then((served) => {
      if (served) return undefined;
      // Resource routes return a Response straight from their loader and never reach
      // entry.server.tsx, which is why the baseline is set here. Documents override it.
      for (const [header, value] of Object.entries(staticAssetHeaders())) {
        response.setHeader(header, value);
      }
      return handleRequest(request, response);
    })
    .catch((error) => {
      console.error(error);
      if (!response.headersSent) response.writeHead(500, { "content-type": "text/plain" });
      response.end("Internal Server Error");
    });
});

const { host, port } = parseServerEnvironment(process.env);
server.listen(port, host, () => {
  const shown = host === "0.0.0.0" || host === "::" ? "localhost" : host;
  console.log(`govops.info listening on http://${shown}:${port}`);
});
