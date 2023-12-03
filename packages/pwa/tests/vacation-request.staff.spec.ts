import { expect, test } from '@playwright/test'

import { staffLogin } from './helpers/auth.test'

test.beforeEach(async ({ page }) => {
  await staffLogin(page)
})

test('Create Vacation Request', async ({ page }) => {
  const timestamp = Date.now()
  const twoDaysFromNow = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0]
  const fourDaysFromNow = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0]

  await page.getByRole('link', { name: 'Staff' }).click()
  await page.getByRole('button', { name: 'Plan a vacation' }).click()
  await page.getByLabel('From').fill(twoDaysFromNow)
  await page.getByLabel('Untill').fill(fourDaysFromNow)
  await page.getByRole('button', { name: 'Request Vacation' }).click()
  await page.getByRole('button', { name: 'ok' }).click()
  expect(page.isVisible('text=' + twoDaysFromNow)).toBeTruthy()
})
