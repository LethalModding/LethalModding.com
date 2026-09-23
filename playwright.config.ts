import { defineConfig, devices } from '@playwright/test'

const baseURL = 'http://localhost:4720'

export default defineConfig({
  testDir: 'e2e',
  outputDir: 'test-results',
  forbidOnly: Boolean(process.env.CI),
  reporter: 'list',
  use: { baseURL },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    // PW_WEB_COMMAND='bunx next dev -p 4720' runs the same smoke against the dev server.
    command: process.env.PW_WEB_COMMAND?.trim() || 'bun run build && bunx next start -p 4720',
    url: baseURL,
    reuseExistingServer: false,
    timeout: 300_000,
  },
})
