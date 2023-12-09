import { expect, test } from '@playwright/test'
import { adminLogin, staffLogin } from './helpers/auth.helper'

test('Basic auth flow', async ({ page }) => {
  // get runner
  const timestamp = Date.now()
  const username = `Test${timestamp}`
  const email = `groep${timestamp}@test.test`
  // Open the page.
  await page.goto('http://localhost:5173/register')
  await page.getByLabel('Username').click()
  await page.getByLabel('Username').fill(username)
  await page.getByLabel('Username').press('Tab')
  await page.getByLabel('VAT number').press('ArrowRight')
  await page.getByLabel('VAT number').fill('BE 0000.000.001')
  await page.getByLabel('VAT number').press('Tab')
  await page.getByLabel('Email').press('Insert')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Email').press('Tab')
  await page.getByLabel('Password').fill('Test1234')
  await page.getByLabel('Password').press('Tab')
  await page.getByRole('button', { name: 'Register' }).press('Enter')

  await page.waitForResponse(response => response.url().includes('/graphql'))

  await expect(page.getByRole('link', { name: 'Reserve' })).toBeVisible()
})

test('admin login', async ({ page }) => {
  await adminLogin(page)
  await expect(page.getByRole('link', { name: 'Administratie' })).toBeVisible()
})

test('staff login', async ({ page }) => {
  await staffLogin(page)
  await expect(page.getByRole('link', { name: 'Staff' })).toBeVisible()
})
