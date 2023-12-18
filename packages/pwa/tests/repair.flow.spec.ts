import { test, expect } from '@playwright/test'

test('create repair request', async ({ page }) => {
  await page.goto('http://localhost:5173/')
  await page.getByRole('link', { name: 'Login' }).click()
  await page.getByLabel('Email').click()
  await page.getByLabel('Email').fill('doran.delfosse@gmail.com')
  await page.getByLabel('Password').click()
  await page.getByLabel('Password').fill('Test1234')
  await page.getByLabel('Password').press('Enter')
  await page.getByRole('link', { name: 'Reparatie' }).click()
  await page.getByLabel('Titel').click()
  await page.getByLabel('Titel').fill('bal verloren')
  await page.locator('label').filter({ hasText: 'Beschrijving' }).click()
  await page.getByLabel('Beschrijving').fill('ruit ingetikt bal kwijt')
  await page.getByLabel('Sportzaal 1').check()
  await page.getByLabel('Hockey stick').check()
  await page.getByRole('button', { name: 'opslaan' }).click()
  await page.waitForResponse(response => response.url().includes('/graphql'))
  await expect(page.locator('a[href="/repair"]')).toBeVisible()
})