import { defineConfig, devices } from "@playwright/test";

const PORT = 3210;
const BASE_URL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env["CI"]),
  retries: process.env["CI"] ? 1 : 0,
  reporter: process.env["CI"] ? "github" : "list",
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    // The built server, not the dev server: this is the thing that ships in the container.
    command: "node server.js",
    cwd: "apps/web",
    env: { PORT: String(PORT), HOST: "127.0.0.1" },
    url: `${BASE_URL}/health`,
    reuseExistingServer: !process.env["CI"],
    timeout: 60_000,
  },
});
