import { Page } from '@playwright/test'

export async function adminLogin(page: Page) {
  await page.goto('http://localhost:5173/login')
  await page.getByLabel('Email').click()
  await page.getByLabel('Email').fill('superadmin@test.test')
  await page.getByLabel('Email').press('Tab')
  await page.getByLabel('Password').fill('Test1234')
  await page.getByLabel('Password').press('Enter')
  await page.waitForResponse(response => response.url().includes('/graphql'))
}

export async function staffLogin(page: Page) {
  await page.goto('http://localhost:5173/login')
  await page.getByLabel('Email').click()
  await page.getByLabel('Email').fill('staff@test.test')
  await page.getByLabel('Email').press('Tab')
  await page.getByLabel('Password').fill('Test1234')
  await page.getByLabel('Password').press('Enter')
  await page.waitForResponse(response => response.url().includes('/graphql'))
}

export async function logOut(page: Page) {
  await page.goto('http://localhost:5173/logout')
}
