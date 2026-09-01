import type { Config } from "@react-router/dev/config";

export default {
  // Documents compile into the server bundle, so rendering one is a lookup, not I/O.
  // Prerendering would also bake a CSP nonce into static HTML that the runtime nonce cannot match.
  ssr: true,
} satisfies Config;
