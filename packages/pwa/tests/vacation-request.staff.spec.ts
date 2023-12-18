import { expect, Page, test } from '@playwright/test'
import { staffLogin, switchToAdmin, switchToStaff } from './helpers/auth.helper'

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

async function deleteApprovedVacationRequest(page: Page) {
  await switchToStaff(page)
  // delete the approved vacation request
  await page.getByRole('link', { name: 'Staff' }).click()
  await page.waitForResponse(response => response.url().includes('/graphql'))
  await page.locator('#vr-closed').click()
  await page.getByRole('button').nth(3).click()
  await page.getByRole('button', { name: 'Cancel request' }).click()
  await expect(
    page
      .locator('div:last-child > .min-w-xs')
      .getByText('Cancelled by staff member'),
  ).toBeVisible()
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
  await createRequest(page)
  expect(await page.isVisible('text=' + getDateFromNow(TWO_DAYS)))

  await switchToStaff(page)
  await cancelVacationRequest(page, true)
})

test('approve vacation request', async ({ page }): Promise<void> => {
  // create vacation request as staff
  await createRequest(page)
  await page.getByRole('button', { name: /Goedkeuren|Approve/ }).click()
  await page.getByRole('button', { name: 'Approve' }).click()
  // check if the vacation request is in the approved vacation requests
  await page.getByText(/Gesloten|Closed/).click()
  expect(await page.isVisible('text=' + getDateFromNow(TWO_DAYS)))
  await deleteApprovedVacationRequest(page)
})

async function createRequest(page: Page) {
  await staffLogin(page)
  await createVacationRequest(page)
  expect(await page.isVisible('text=' + getDateFromNow(TWO_DAYS)))
  await switchToAdmin(page)
  // approve vacation request
  await page.locator('a[href="/admin"]').click()
  await page.locator('a[href="/admin/vacation"]:first-child').click()
}
