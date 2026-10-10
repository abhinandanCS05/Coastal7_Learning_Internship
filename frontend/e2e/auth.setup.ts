import { test as setup, expect } from '@playwright/test';

async function loginAndSave(page, email, password, path, expected) {
  await page.goto('/login');
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole('button', { name: /sign in|login/i }).click();
  await expect(page).toHaveURL(new RegExp(expected));
  await page.context().storageState({ path });
}

setup('customer authentication', async ({ page }) => {
  await loginAndSave(
    page,
    'demo@shopflow.com',
    'Demo@123',
    'e2e/.auth/customer.json',
    '/app'
  );
});

setup('admin authentication', async ({ page }) => {
  await loginAndSave(
    page,
    'admin@shopflow.com',
    'Admin@123',
    'e2e/.auth/admin.json',
    '/app/admin'
  );
});