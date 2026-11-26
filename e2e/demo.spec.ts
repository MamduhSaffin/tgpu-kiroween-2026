import { expect, test } from '@playwright/test'

for (const width of [320, 375, 390, 768, 1024, 1440]) {
  test(`sample match, route refresh and navigation at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 850 })
    const pageErrors: string[] = []
    page.on('pageerror', error => pageErrors.push(error.message))
    const assertFits = async () => {
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)
    }

    await page.goto('/')
    await assertFits()
    const started = Date.now()
    await page.getByRole('link', { name: 'Try a sample match' }).click()
    await expect(page.getByText('Top Match')).toBeVisible()
    expect(Date.now() - started).toBeLessThan(15_000)
    await expect(page.getByText('Commercial opportunity').first()).toBeVisible()
    await expect(page.getByText('Gaps and risks').first()).toBeVisible()
    await assertFits()
    const reload = await page.reload()
    expect(reload?.status()).toBe(200)
    expect(reload?.headers()['content-type']).toContain('text/html')
    await expect(page.getByRole('heading', { name: 'Partner Matching' })).toBeVisible()
    await expect(page.getByLabel('Company to match')).toHaveValue('my-001')

    await page.evaluate(() => window.scrollTo(0, 500))
    const navigation = page.getByRole('navigation', { name: 'Main navigation' })
    if (width < 768) {
      const menu = navigation.getByRole('button', { name: 'Toggle menu' })
      await menu.focus()
      await page.keyboard.press('Enter')
      await expect(menu).toHaveAttribute('aria-expanded', 'true')
      await page.keyboard.press('Escape')
      await expect(menu).toHaveAttribute('aria-expanded', 'false')
      await expect(menu).toBeFocused()
      await menu.click()
    }
    await navigation.getByRole('link', { name: 'Directory', exact: true }).click()
    await expect(page.getByRole('heading', { name: 'Company Directory' })).toBeVisible()
    expect(await page.evaluate(() => window.scrollY)).toBe(0)
    await assertFits()
    for (const route of ['/directory/my-001', '/register', '/dashboard']) {
      expect((await page.goto(route))?.status()).toBe(200)
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
      await assertFits()
    }
    expect(pageErrors).toEqual([])
  })
}

test('combines directory search and filters and clears empty results', async ({ page }) => {
  await page.goto('/directory')
  await page.getByRole('searchbox', { name: 'Search companies' }).fill('  foods  ')
  await page.getByRole('button', { name: 'Filters', exact: true }).click()
  await page.getByLabel('Country', { exact: true }).selectOption('Malaysia')
  await page.getByLabel('Role', { exact: true }).selectOption('exporter')
  await page.getByLabel('Sector', { exact: true }).selectOption('Food & Beverage')
  await expect(page.getByRole('status')).toContainText('1 of 16')
  await expect(page.getByText('NusaPure Foods Sdn Bhd', { exact: true })).toBeVisible()
  await page.getByLabel('Country', { exact: true }).selectOption('Kuwait')
  await expect(page.getByText('No companies match your filters.')).toBeVisible()
  await page.getByRole('button', { name: 'Clear filters', exact: true }).click()
  await expect(page.getByRole('status')).toContainText('16 of 16')
})

test('registration, duplicates, shortlist, enquiries and reset persist through navigation and refresh', async ({ page }) => {
  await page.goto('/register')
  const register = async (companyName: string) => {
    await page.getByLabel('Company Name *').fill(companyName)
    await page.getByLabel('City *').fill('Shah Alam')
    await page.getByLabel('Products / Services (comma-separated) *').fill('Frozen meals, frozen meals')
    await page.getByRole('button', { name: 'Distribution Agreement' }).click()
    await page.getByRole('button', { name: 'UAE', exact: true }).click()
    await page.getByRole('button', { name: 'Distributor Search' }).click()
    await page.getByRole('button', { name: 'Register Company' }).click()
  }

  await register('Fictional Sample Exporter')
  await expect(page.getByText('Profile Registered!')).toBeVisible()
  await page.getByRole('button', { name: 'Register Another' }).click()
  await register(' fictional   SAMPLE exporter ')
  await expect(page.getByRole('alert')).toContainText('already registered')

  await page.goto('/match?company=my-001')
  await page.getByRole('button', { name: /^Add .* to shortlist$/ }).first().click()
  const openEnquiry = page.getByRole('button', { name: 'Enquire', exact: true }).first()
  await openEnquiry.click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toBeHidden()
  await expect(openEnquiry).toBeFocused()
  await openEnquiry.click()
  await page.getByLabel('Message', { exact: true }).fill('Short')
  await page.getByRole('button', { name: 'Save Enquiry' }).click()
  await expect(page.getByRole('alert')).toContainText('at least 20')
  await page.getByLabel('Message', { exact: true }).fill('Please share your available wholesale terms.')
  await page.getByRole('button', { name: 'Save Enquiry' }).click()
  await expect(page.getByText('Enquiry Saved', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Done' }).click()

  await page.goto('/dashboard')
  await page.reload()
  await expect(page.getByText('Fictional Sample Exporter', { exact: true })).toBeVisible()
  await expect(page.getByText('Please share your available wholesale terms.', { exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: /remove.*from shortlist/i })).toHaveCount(1)
  page.once('dialog', dialog => dialog.accept())
  await page.getByRole('button', { name: 'Reset demo data' }).click()
  await expect(page.getByRole('status')).toContainText('Demo data reset')
  await page.reload()
  await expect(page.getByText('No shortlisted companies yet.')).toBeVisible()
  await expect(page.getByText('Fictional Sample Exporter', { exact: true })).toHaveCount(0)
  await expect(page.getByText('Please share your available wholesale terms.', { exact: true })).toHaveCount(0)
})
