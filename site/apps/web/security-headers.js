/**
 * An allowlist over `default-src 'self'`, with two declared exceptions: the GitHub API that the
 * releases page calls, and `data:` images. Scripts are admitted only by the per-response nonce
 * from `app/entry.server.tsx` — the outer layer that makes rendering GitHub release notes safe,
 * with sanitisation in `@govops/content` as the inner one.
 */
const SHARED_HEADERS = {
  "referrer-policy": "strict-origin-when-cross-origin",
  "x-content-type-options": "nosniff",
  "x-frame-options": "DENY",
  "cross-origin-opener-policy": "same-origin",
  "cross-origin-resource-policy": "same-origin",
  "permissions-policy": "camera=(), geolocation=(), microphone=(), payment=(), usb=()",
  "strict-transport-security": "max-age=31536000; includeSubDomains",
};

export function contentSecurityPolicy(nonce) {
  return [
    "default-src 'self'",
    "base-uri 'none'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "img-src 'self' data:",
    "font-src 'self'",
    "manifest-src 'self'",
    "connect-src 'self' https://api.github.com",
    nonce ? `script-src 'self' 'nonce-${nonce}'` : "script-src 'none'",
    "style-src 'self' 'unsafe-inline'",
    "worker-src 'self'",
    "upgrade-insecure-requests",
  ].join("; ");
}

/** Admits only the scripts carrying this nonce. */
export function documentHeaders(nonce) {
  return { ...SHARED_HEADERS, "content-security-policy": contentSecurityPolicy(nonce) };
}

/** No script may execute from a static file, so none is admitted. */
export function staticAssetHeaders() {
  return { ...SHARED_HEADERS, "content-security-policy": contentSecurityPolicy(null) };
}
