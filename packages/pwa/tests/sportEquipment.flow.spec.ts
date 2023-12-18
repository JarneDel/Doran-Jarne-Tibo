import { test, expect } from '@playwright/test';

test('Create Item', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByLabel('Email').click();
  await page.getByLabel('Email').fill('superadmin@test.test');
  await page.getByLabel('Email').press('Tab');
  await page.getByLabel('Password').fill('Test1234');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'Administratie' }).click();
  await page.getByRole('link', { name: 'Sportuitrusting' }).click();
  await page.locator('a:nth-child(4)').first().click();
  await page.getByRole('button', { name: 'Nieuw item' }).click();
  await page.getByLabel('Naam0/').click();
  await page.getByLabel('Naam0/').fill('Baseball bat');
  await page.getByLabel('Beschrijving').fill('Dit is een baseball bat');
  await page.getByLabel('Beschrijving').press('Tab');
  await page.getByLabel('Wat is een ideaal bedrag om').fill('5');
  await page.getByLabel('Wat is een ideaal bedrag om').press('Tab');
  await page.getByLabel('Hoeveel items wilt u nu').fill('4');
  await page.getByLabel('Hoeveel items wilt u nu').press('Tab');
  await page.getByLabel('Prijs per uur(€)').fill('8');
  await page.getByLabel('Volleybal').check();
  await page.getByRole('button', { name: 'Maak een item' }).click();
  await page.waitForResponse(response => response.url().includes('/graphql'))
  await expect(page.locator('a[href="/admin/sport-equipment"]')).toBeVisible()
});

test('Update Item', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByLabel('Email').click();
    await page.getByLabel('Email').fill('superadmin@test.test');
    await page.getByLabel('Email').press('Tab');
    await page.getByLabel('Password').fill('Test1234');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('link', { name: 'Administratie' }).click();
    await page.getByRole('link', { name: 'Sportuitrusting' }).click();
    await page.getByRole('row', { name: 'Basketbal Een bal voor' }).getByRole('link').click();
    await page.locator('#app div').filter({ hasText: 'BasketbalBeschrijvingEen bal' }).getByRole('button').nth(1).click();
    await page.getByLabel('Ideaal').click();
    await page.getByLabel('Ideaal').fill('6');
    await page.getByLabel('Prijs per uur(€)').click();
    await page.getByLabel('Prijs per uur(€)').fill('6');
    await page.getByRole('button', { name: 'Wijzig het item' }).click();
    await page.waitForResponse(response => response.url().includes('/graphql'))
    await expect(page.locator('a[href="/admin/sport-equipment"]')).toBeVisible()
  });


  test('Remove Item', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByLabel('Email').click();
    await page.getByLabel('Email').fill('superadmin@test.test');
    await page.getByLabel('Email').press('Tab');
    await page.getByLabel('Password').fill('Test1234');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('link', { name: 'Administratie' }).click();
    await page.getByRole('link', { name: 'Sportuitrusting' }).click();
    await page.waitForResponse(response => response.url().includes('/graphql'))
    await page.getByRole('row', { name: 'zwemvliezen zwemvliezen voor' }).getByRole('link').click();
    page.once('dialog', dialog => {
      console.log(`Dialog message: ${dialog.message()}`);
      dialog.dismiss().catch(() => {});
    });
    await page.locator('#app div').filter({ hasText: 'zwemvliezenBeschrijvingzwemvliezen voor zwemmen en' }).getByRole('button').first().click();
    await expect(page.locator('a[href="/admin/sport-equipment"]')).toBeVisible()
  });