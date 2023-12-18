import { test, expect } from '@playwright/test';

test('Create Service', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByLabel('Email').click();
  await page.getByLabel('Email').fill('superadmin@test.test');
  await page.getByLabel('Email').press('Tab');
  await page.getByLabel('Password').fill('Test1234');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'Administratie' }).click();
  await page.locator('a:nth-child(11)').click();
  await page.getByRole('button', { name: 'Nieuw item' }).click();
  await page.getByPlaceholder('Geef de naam van de service').click();
  await page.getByPlaceholder('Geef de naam van de service').fill('Test');
  await page.getByPlaceholder('Geef de naam van de service').press('Tab');
  await page.getByPlaceholder('Geef een korte beschrijving').fill('Dit is een test');
  await page.getByText('Sportzaal 1').click();
  await page.getByText('staff').click();
  await page.getByRole('button', { name: 'Maak een item' }).click();
  await page.waitForResponse(response => response.url().includes('/graphql'))
  await expect(page.locator('a[href="/admin/services"]')).toBeVisible()
});


test('Update Service', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByLabel('Email').click();
    await page.getByLabel('Email').fill('superadmin@test.test');
    await page.getByLabel('Email').press('Tab');
    await page.getByLabel('Password').fill('Test1234');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('link', { name: 'Administratie' }).click();
    await page.locator('a:nth-child(11)').click();
    await page.getByRole('button', { name: 'Cleaning Service Kamers:' }).click();
    await page.locator('.flex > div > .bg-primary-surface').click();
    await page.getByLabel('Kuisruimte').check();
    await page.getByLabel('admin', { exact: true }).check();
    await page.getByRole('button', { name: 'Wijzig het item' }).click();
    await page.waitForResponse(response => response.url().includes('/graphql'))
    await expect(page.locator('a[href="/admin/services"]')).toBeVisible()
  });


  test('Remove Service', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByLabel('Email').click();
    await page.getByLabel('Email').fill('superadmin@test.test');
    await page.getByLabel('Email').press('Tab');
    await page.getByLabel('Password').fill('Test1234');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('link', { name: 'Administratie' }).click();
    await page.locator('a:nth-child(11)').click();
    await page.getByRole('button', { name: 'Gardening Service Kamers:' }).click();
    page.once('dialog', dialog => {
      console.log(`Dialog message: ${dialog.message()}`);
      dialog.dismiss().catch(() => {});
    });
    await page.locator('.bg-danger-surface').click();
    await expect(page.locator('a[href="/admin/services"]')).toBeVisible()
  });