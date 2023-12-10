import { expect, Page, test } from '@playwright/test'
import { staffLogin, adminLogin } from './helpers/auth.helper'

const TWO_DAYS = 2 * 24 * 60 * 60 * 1000
const FOUR_DAYS = 4 * 24 * 60 * 60 * 1000

const getDateFromNow = (days: number) =>
  new Date(Date.now() + days).toISOString().split('T')[0]

async function createVacationRequest(page: Page) {
  let vacationExists = true

  while (vacationExists) {
    const twoDaysFromNow = getDateFromNow(TWO_DAYS)
    const fourDaysFromNow = getDateFromNow(FOUR_DAYS)

    await page.getByRole('link', { name: 'Staff' }).click()
    await page.getByRole('button', { name: 'Plan a vacation' }).click()
    await page.getByLabel('From').fill(twoDaysFromNow)
    await page.getByLabel('Untill').fill(fourDaysFromNow)

    if (await page.getByText('You already have a vacation').isVisible()) {
      await cancelVacationRequest(page, true)
      await page.waitForResponse(response =>
        response.url().includes('/graphql'),
      )
    } else {
      vacationExists = false
      await page.getByRole('button', { name: 'Request Vacation' }).click()
      await page.waitForResponse(response =>
        response.url().includes('/graphql'),
      )
      await page.getByRole('button', { name: 'ok' }).click()
    }
  }
}

async function cancelVacationRequest(page: Page, reload: boolean) {
  if (reload) await page.goto('http://localhost:5173/staff')
  const button = page.getByRole('button').nth(3)
  expect(await button.isVisible())
  await button.click()
  await page.getByRole('button', { name: 'Cancel request' }).click()
}

test('Create Vacation Request', async ({ page }) => {
  // login as staff
  await staffLogin(page)
  // create vacation request
  await createVacationRequest(page)
  // check if vacation request is in open vacation requests, with the right date
  expect(await page.isVisible('text=' + getDateFromNow(TWO_DAYS)))
  // cancel vacation request
  await cancelVacationRequest(page, false)
  // check if the vacation request is cancelled
  await page.waitForResponse(response => response.url().includes('/graphql'))
})

test('view open vacation requests', async ({ page }): Promise<void> => {
  // create vacation request as staff
  await staffLogin(page)
  await createVacationRequest(page)
  expect(await page.isVisible('text=' + getDateFromNow(TWO_DAYS)))
  // log in as admin
  await page.getByRole('button', { name: 'staff' }).click()
  await page.getByRole('button', { name: 'Log out' }).click()
  await page.waitForURL('http://localhost:5173/login')
  console.log('logging in')
  await adminLogin(page)
  // check if the vacation request is in the open vacation requests
  await page.locator('a[href="/admin"]').click()
  await page.locator('a[href="/admin/vacation"]').click()
  expect(await page.isVisible('text=' + getDateFromNow(TWO_DAYS)))
})
