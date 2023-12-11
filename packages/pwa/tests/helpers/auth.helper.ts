import { Page } from '@playwright/test'

export async function changeLanguage(page: Page, language: string) {
  await page.getByRole('button', { name: 'Language' }).click()
  await page.getByRole('button', { name: language }).click()
}

export async function adminLogin(page: Page) {
  await page.goto('http://localhost:5173/login')
  await changeLanguage(page, 'English')
  await page.getByLabel('Email').click()
  await page.getByLabel('Email').fill('superadmin@test.test')
  await page.getByLabel('Email').press('Tab')
  await page.getByLabel('Password').fill('Test1234')
  await page.getByLabel('Password').press('Enter')
  await page.waitForResponse(response => response.url().includes('/graphql'))
}

export async function staffLogin(page: Page) {
  await page.goto('http://localhost:5173/login')
  await changeLanguage(page, 'English')
  await page.getByLabel('Email').click()
  await page.getByLabel('Email').fill('staff@test.test')
  await page.getByLabel('Email').press('Tab')
  await page.getByLabel('Password').fill('Test1234')
  await page.getByLabel('Password').press('Enter')
  await page.waitForResponse(response => response.url().includes('/graphql'))
}

export async function logOut(page: Page) {
  await page.locator('#profile').click()
  await page.locator('#account-log-out').click()
  await page.waitForURL('http://localhost:5173/login')
}

export async function switchToStaff(page: Page) {
  await logOut(page)
  await staffLogin(page)
}

export async function switchToAdmin(page: Page) {
  await logOut(page)
  await adminLogin(page)
}
