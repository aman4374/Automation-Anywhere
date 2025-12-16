import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./src/tests",
  timeout: 60000,
  retries: 1,
  use: {
    headless: false,
    viewport: { width: 1280, height: 720 },

    // ADD THIS SECTION TO HANDLE THE BROWSER POPUP
    launchOptions: {
      args: [
        "--disable-web-security",
        "--disable-features=IsolateOrigins,site-per-process", // Helps with cross-origin frames
        "--disable-site-isolation-trials",
      ],
      // Sometimes granting permissions helps avoid prompts
      ignoreDefaultArgs: ["--enable-automation"],
    },
    // Grant permissions to avoid some prompts
    permissions: ["clipboard-read", "clipboard-write"],
    baseURL: "https://community.cloud.automationanywhere.digital",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  reporter: [["html"], ["list"], ["json", { outputFile: "test-results.json" }]],
});
