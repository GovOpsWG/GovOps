/**
 * The closest local proxy for Cloud Run: exercises the built server, the static file handler, and
 * the security headers exactly as they will be served.
 */
const BASE = process.env.SMOKE_URL ?? "http://127.0.0.1:8080";

const CHECKS = [
  { path: "/health", expect: 200, contains: '"status":"ok"' },
  { path: "/", expect: 200, contains: "Measure risk, transparency," },
  { path: "/docs", expect: 200, contains: "GovOps documentation" },
  { path: "/docs/architecture", expect: 200, contains: "GOVERNANCE PLANE" },
  { path: "/docs/acc/authorization-capability-catalog-design", expect: 200, contains: "Abstract" },
  { path: "/releases", expect: 200, contains: "Releases" },
  { path: "/api/search?q=capability", expect: 200, contains: '"route"' },
  { path: "/sitemap.xml", expect: 200, contains: "<urlset" },
  { path: "/robots.txt", expect: 200, contains: "Sitemap:" },
  { path: "/brand/govops-mark.png", expect: 200 },
  { path: "/this-page-does-not-exist", expect: 404 },
];

let failures = 0;

for (const check of CHECKS) {
  const url = `${BASE}${check.path}`;
  try {
    const response = await fetch(url, { redirect: "manual" });
    const body = await response.text();

    if (response.status !== check.expect) {
      console.error(`FAIL ${check.path} — expected ${check.expect}, got ${response.status}`);
      failures += 1;
      continue;
    }

    if (check.contains && !body.includes(check.contains)) {
      console.error(`FAIL ${check.path} — body did not contain ${JSON.stringify(check.contains)}`);
      failures += 1;
      continue;
    }

    const csp = response.headers.get("content-security-policy");
    if (!csp?.includes("default-src 'self'")) {
      console.error(`FAIL ${check.path} — missing Content-Security-Policy`);
      failures += 1;
      continue;
    }

    console.log(`ok   ${check.path}`);
  } catch (error) {
    console.error(`FAIL ${check.path} — ${String(error)}`);
    failures += 1;
  }
}

// The nonce in the header must be the one on the scripts, or every script is blocked in production.
const document = await fetch(BASE);
const headerNonce = /nonce-([a-f0-9]+)/.exec(document.headers.get("content-security-policy") ?? "");
const html = await document.text();
const bodyNonce = /nonce="([a-f0-9]+)"/.exec(html);

if (!headerNonce || !bodyNonce || headerNonce[1] !== bodyNonce[1]) {
  console.error("FAIL / — Content-Security-Policy nonce does not match the rendered scripts");
  failures += 1;
} else if (/<script(?![^>]*nonce)/.test(html)) {
  console.error("FAIL / — a script tag was rendered without a nonce");
  failures += 1;
} else {
  console.log("ok   / — nonce matches every script tag");
}

if (failures > 0) {
  console.error(`\n${failures} smoke check(s) failed.`);
  process.exit(1);
}

console.log("\nAll smoke checks passed.");
