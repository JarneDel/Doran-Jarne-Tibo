import { test, expect } from '@playwright/test';

test('Create Room', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByLabel('Email').click();
  await page.getByLabel('Email').fill('superadmin@test.test');
  await page.getByLabel('Email').press('Tab');
  await page.getByLabel('Password').fill('Test1234');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'Administratie' }).click();
  await page.getByRole('link', { name: 'Kamers' }).click();
  await page.waitForResponse(response => response.url().includes('/graphql'))
  await page.getByRole('button', { name: 'Sportzaal 1 Sports: Basketbal' }).click();
  await page.locator('div').filter({ hasText: /^Sportzaal 1Sports:VoetbalHandbalBasketbalPrice per hour:€35$/ }).getByRole('button').nth(2).click();
  await page.locator('a:nth-child(4)').first().click();
  await page.locator('a:nth-child(5)').first().click();
  await page.locator('ul').filter({ hasText: 'Sportzaal 1Sports:' }).getByRole('link').click();
  await page.getByLabel('Title').click();
  await page.getByLabel('Title').fill('Zaal 7');
  await page.getByLabel('Voetbal').check();
  await page.getByLabel('Volleybal').check();
  await page.getByLabel('Handbal').check();
  await page.getByLabel('Basketbal').check();
  await page.getByLabel('Prijs per uur').click();
  await page.getByLabel('Prijs per uur').fill('26');
  await page.getByRole('button', { name: 'Maak een kamer' }).click();
  await page.waitForResponse(response => response.url().includes('/graphql'))
  await expect(page.locator('a[href="/admin/rooms"]')).toBeVisible()
});

test('Update Room', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByLabel('Email').click();
    await page.getByLabel('Email').fill('superadmin@test.test');
    await page.getByLabel('Email').press('Tab');
    await page.getByLabel('Password').fill('Test1234');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('link', { name: 'Administratie' }).click();
    await page.getByRole('link', { name: 'Kamers' }).click();
    await page.getByRole('button', { name: 'Sportzaal 1 Sports: Basketbal' }).click();
    await page.locator('div').filter({ hasText: /^Sportzaal 1Sports:VoetbalHandbalBasketbalPrice per hour:€35$/ }).getByRole('button').nth(1).click();
    await page.getByLabel('Naam').click();
    await page.getByLabel('Naam').fill('Sportzaal 1 bijwerken');
    await page.getByLabel('Voetbal').uncheck();
    await page.getByLabel('Prijs per uur').click({
      clickCount: 4
    });
    await page.getByLabel('Prijs per uur').click({
      clickCount: 4
    });
    await page.getByLabel('Prijs per uur').click();
    await page.getByLabel('Prijs per uur').fill('30');
    await page.getByRole('button', { name: 'Wijzig het item' }).click();
    await page.waitForResponse(response => response.url().includes('/graphql'))
    await expect(page.locator('a[href="/admin/rooms"]')).toBeVisible()
  });


  test('Remove room', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByLabel('Email').click();
    await page.getByLabel('Email').fill('Superadmin@test.test');
    await page.getByLabel('Email').press('Tab');
    await page.getByLabel('Password').fill('Test1234');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('link', { name: 'Administratie' }).click();
    await page.getByRole('link', { name: 'Kamers' }).click();
    await page.waitForResponse(response => response.url().includes('/graphql'))
    await page.getByRole('button', { name: 'Sportzaal 2 Sports: Handbal' }).click();
    page.once('dialog', dialog => {
      console.log(`Dialog message: ${dialog.message()}`);
      dialog.dismiss().catch(() => {});
    });
    await page.locator('div').filter({ hasText: /^Sportzaal 2Sports:VoetbalHandbalPrice per hour:€30$/ }).getByRole('button').first().click();
  });