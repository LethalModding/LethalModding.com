import { expect, test } from '@playwright/test'
import packages from './thunderstore-packages.json' with { type: 'json' }

// The live package index is hundreds of megabytes, and a page of its icons fetched in one
// burst trips the CDN's rate limit; two real packages keep the icons on the real host.
test.beforeEach(async ({ page }) => {
  await page.route('https://thunderstore.io/c/lethal-company/api/v1/package/', (route) =>
    route.fulfill({ json: packages }),
  )
})

for (const path of ['/', '/tools', '/team', '/team/profile']) {
  test(`${path} renders without errors`, async ({ page }) => {
    const problems: string[] = []
    page.on('console', (message) => {
      if (message.type() === 'error') {
        problems.push(`console: ${message.text()}`)
      }
    })
    page.on('pageerror', (error) => problems.push(`pageerror: ${error.message}`))
    page.on('response', (failed) => {
      if (failed.status() >= 400) {
        problems.push(`${failed.status()} ${failed.url()}`)
      }
    })

    const response = await page.goto(path, { waitUntil: 'networkidle' })

    expect(response?.status()).toBe(200)
    await expect(page).toHaveTitle(/\S/)
    expect(problems).toEqual([])
  })
}

test('/tools loads Thunderstore icons lazily, straight from the CDN', async ({ page }) => {
  const optimizedRemote: string[] = []
  page.on('request', (request) => {
    const url = new URL(request.url())
    if (
      url.pathname.startsWith('/_next/image') &&
      url.searchParams.get('url')?.startsWith('http')
    ) {
      optimizedRemote.push(request.url())
    }
  })

  await page.goto('/tools', { waitUntil: 'networkidle' })

  const icon = page.getByRole('img', { name: packages[0]?.name ?? '' })
  await expect(icon).toHaveAttribute('src', packages[0]?.versions[0]?.icon ?? '')
  await expect(icon).toHaveAttribute('loading', 'lazy')
  await expect(icon).toHaveJSProperty('complete', true)
  expect(await icon.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0)
  expect(optimizedRemote).toEqual([])
})
