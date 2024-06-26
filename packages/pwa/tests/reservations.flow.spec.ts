import { expect, test } from '@playwright/test'

test('create reservation', async ({ page }) => {
  await page.goto('http://localhost:5173/')
  await page.getByRole('link', { name: 'Login' }).click()
  await page.getByLabel('Email').click()
  await page.getByLabel('Email').fill('desprinters@test.test')
  await page.getByLabel('Password').click()
  await page.getByLabel('Password').fill('Test1234')
  await page.getByLabel('Password').press('Enter')
  await page.getByRole('link', { name: 'Reserveren' }).click()
  await page.getByRole('button', { name: 'Reserveren' }).click()
  await page.waitForResponse(response => response.url().includes('/graphql'))
  await page.getByLabel('Datum').fill('2024-01-13')
  await page.getByText('Sportzaal 1').click()
  await page
    .locator('div')
    .filter({ hasText: /^Sportzaal 2VoetbalHandbal€ 30\/h$/ })
    .first()
    .click()
  await page.getByText('Kleedruimte 4€ 15/h').click()
  await page
    .locator('div')
    .filter({ hasText: /^0\/3$/ })
    .getByRole('button')
    .nth(1)
    .click()
  await page
    .locator('div')
    .filter({ hasText: /^1\/3$/ })
    .getByRole('button')
    .nth(1)
    .click()
  await page
    .locator('div')
    .filter({ hasText: /^2\/3$/ })
    .getByRole('button')
    .nth(1)
    .click({
      clickCount: 3,
    })
  await page.getByRole('button', { name: 'Detail' }).click()
  await page.getByRole('button', { name: 'Reserveren' }).click()
  await page.waitForResponse(response => response.url().includes('/graphql'))
  await expect(page.locator('a[href="/reservation"]')).toBeVisible()
})

test('Change Reservation', async ({ page }) => {
  await page.goto('http://localhost:5173/')
  await page.getByRole('link', { name: 'Login' }).click()
  await page.getByLabel('Email').click()
  await page.getByLabel('Email').fill('desprinters@test.test')
  await page.getByLabel('Password').click()
  await page.getByLabel('Password').fill('Test1234')
  await page.getByLabel('Password').press('Enter')
  await page.locator('li').filter({ hasText: 'Reserveren' }).click()
  await page.getByRole('link', { name: 'Reserveren' }).click()
  await page
    .locator('div')
    .filter({
      hasText:
        /^13\/1\/202408:0018:00Sportzaal 1Sportzaal 2Kleedruimte 43 x Handbal$/,
    })
    .getByRole('link')
    .click()
  await page
    .locator('div')
    .filter({ hasText: /^3\/3$/ })
    .getByRole('button')
    .first()
    .click()
  await page
    .locator('div')
    .filter({ hasText: /^0\/6$/ })
    .getByRole('button')
    .nth(1)
    .click()
  await page.getByRole('button', { name: 'Detail' }).click()
  await page.getByRole('button', { name: 'Reserveren' }).click()
  await page.waitForResponse(response => response.url().includes('/graphql'))
  await expect(page.locator('a[href="/reservation"]')).toBeVisible()
})

test('Cancel reservation', async ({ page }) => {
  await page.goto('http://localhost:5173/')
  await page.getByRole('link', { name: 'Login' }).click()
  await page.getByLabel('Email').click()
  await page.getByLabel('Email').fill('desprinters@test.test')
  await page.getByLabel('Password').click()
  await page.getByLabel('Password').fill('Test1234')
  await page.getByLabel('Password').press('Enter')
  await page.getByRole('link', { name: 'Reserveren' }).click()
  await page.getByRole('button', { name: 'Annuleren' }).click()
  await page.waitForResponse(response => response.url().includes('/graphql'))
  await expect(page.locator('a[href="/reservation"]')).toBeVisible()
})
