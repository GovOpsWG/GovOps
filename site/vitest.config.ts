import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@govops/content/generated": fileURLToPath(
        new URL("./packages/content/src/generated/index.ts", import.meta.url),
      ),
      "@govops/content": fileURLToPath(new URL("./packages/content/src/index.ts", import.meta.url)),
      "~": fileURLToPath(new URL("./apps/web/app", import.meta.url)),
    },
  },
  test: {
    include: ["packages/**/tests/**/*.test.ts", "tests/**/*.test.ts"],
    environment: "node",
    restoreMocks: true,
  },
});
