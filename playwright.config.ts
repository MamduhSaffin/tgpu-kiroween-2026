import { defineConfig } from '@playwright/test'

const baseURL = process.env.DEMO_BASE_URL || 'http://127.0.0.1:4173'

export default defineConfig({
  testDir: './e2e',
  workers: 2,
  use: {
    baseURL,
    launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE },
  },
  webServer: process.env.DEMO_BASE_URL ? undefined : {
    command: 'npm run preview:worker',
    url: baseURL,
    timeout: 30_000,
    env: { WRANGLER_SEND_METRICS: 'false' },
  },
})
