import exp from 'constants';

// @ts-check
const { test, expect} = require('@playwright/test');

// change this to the URL of your website, could be local or GitHub pages
const websiteURL = 'http://127.0.0.1:3000/people-look-up.html';

// Go to the website home page before each test.
test.beforeEach(async ({ page }) => {
   await page.goto(websiteURL);
});

// Add a vehicle without any fields filled.
test('add a vehicle without any fields', async ({page}) => {
    await page.getByRole('link', { name: 'Add a vehicle' }).click();
    await page.getByRole('button', { name: 'Add' }).click();
    await expect(page.locator('#message')).toContainText('Error')
});

// Add a vehicle without some fields filled.
test('add a vehicle without some fields', async ({page}) => {
    await page.getByRole('link', { name: 'Add a vehicle' }).click();
    await page.locator('#rego').fill('Testplate')
    await page.locator('#make').fill('Testmake')
    await page.locator('#model').fill('Testmodel')
    await page.getByRole('button', { name: 'Add' }).click();
    await expect(page.locator('#message')).toContainText('Error')
});

// Add a vehicle with all vehicle fields filled, owner not in db, but empty fields for owner.
test('add a vehicle without any owner fields', async ({page}) => {
    await page.getByRole('link', { name: 'Add a vehicle' }).click();
   await page.locator('#rego').fill('a')
   await page.locator('#make').fill('a')
   await page.locator('#model').fill('a')
   await page.locator('#colour').fill('a')
   await page.locator('#owner').fill('TestName')
   await page.getByRole('button', { name: 'Add' }).click();
   await page.getByRole('button', { name: 'Add owner' }).click();
   await expect(page.locator('#message')).toContainText('Error')
});

// Add a vehicle with all vehicle fields filled, owner not in db, but some empty fields for owner.
test('add a vehicle without some owner fields', async ({page}) => {
    await page.getByRole('link', { name: 'Add a vehicle' }).click();
   await page.locator('#rego').fill('b')
   await page.locator('#make').fill('b')
   await page.locator('#model').fill('b')
   await page.locator('#colour').fill('b')
   await page.locator('#owner').fill('TestName')
   await page.getByRole('button', { name: 'Add' }).click();
   await page.locator('#personid').fill('99')
   await page.locator('#name').fill('b')
   await page.locator('#address').fill('b')
   await page.locator('#license').fill('b')
   await page.getByRole('button', { name: 'Add owner' }).click();
   await expect(page.locator('#message')).toContainText('Error')
});

// Add a vehicle with all vehicle fields filled, owner in db
test('add a vehicle for preexisting owner', async ({page}) => {
    await page.getByRole('link', { name: 'Add a vehicle' }).click();
   await page.locator('#rego').fill('d')
   await page.locator('#make').fill('d')
   await page.locator('#model').fill('d')
   await page.locator('#colour').fill('d')
   await page.locator('#owner').fill('Rachel Smith')
   await page.getByRole('button', { name: 'Add' }).click();
   await expect(page.locator('#message')).toContainText('Vehicle added successfully')
});

// Add a vehicle and person with all fields filled but pre-existing person PK
test('add a vehicle with existing person PK', async ({page}) => {
    await page.getByRole('link', { name: 'Add a vehicle' }).click();
   await page.locator('#rego').fill('e')
   await page.locator('#make').fill('e')
   await page.locator('#model').fill('e')
   await page.locator('#colour').fill('e')
   await page.locator('#owner').fill('e')
   await page.getByRole('button', { name: 'Add' }).click();
   await page.locator('#personid').fill('1')
   await page.locator('#name').fill('e')
   await page.locator('#address').fill('e')
   await page.locator('#dob').fill('e')
   await page.locator('#license').fill('e')
   await page.locator('#expire').fill('e')
   await page.getByRole('button', { name: 'Add owner' }).click();
   await expect(page.locator('#message')).toContainText('Error')
});

// Add a vehicle and person with all fields filled but pre-existing vehicle PK
test('add a vehicle with existing vehicle PK', async ({page}) => {
    await page.getByRole('link', { name: 'Add a vehicle' }).click();
   await page.locator('#rego').fill('KWK24JI')
   await page.locator('#make').fill('f')
   await page.locator('#model').fill('f')
   await page.locator('#colour').fill('f')
   await page.locator('#owner').fill('Rachel Smith')
   await page.getByRole('button', { name: 'Add' }).click();
   await expect(page.locator('#message')).toContainText('Error')
});