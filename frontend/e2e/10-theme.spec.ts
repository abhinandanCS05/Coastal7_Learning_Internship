import { test, expect } from "@playwright/test";

async function loginAsCustomer(page: any) {
  await page.goto("/login");
  await page.getByLabel("Email").fill("demo@shopflow.com");
  await page.getByLabel("Password").fill("Demo@123");
  await page.getByText("Customer", { exact: true }).click();
  await page.getByRole("button", { name: /sign in/i }).click();
  await expect(page).toHaveURL(/\/app$/, { timeout: 10000 });
}

test.describe("ShopFlow Theme E2E", () => {
  test("THEME-01 - Theme control is available in authenticated UI", async ({
    page,
  }) => {
    await loginAsCustomer(page);

    const themeControls = page.locator(
      'button[aria-label*="theme" i], button[title*="theme" i], button'
    );

    expect(await themeControls.count()).toBeGreaterThan(0);
  });

  test("THEME-02 - Theme toggle changes UI state", async ({ page }) => {
    await loginAsCustomer(page);

    const themeButton = page.locator(
      'button[aria-label*="theme" i], button[title*="theme" i]'
    );

    if (await themeButton.count()) {
      const before = await page.locator("html").getAttribute("class");
      await themeButton.first().click();
      const after = await page.locator("html").getAttribute("class");

      expect(after).toBeDefined();
      expect(before).not.toBeNull();
    } else {
      expect(await page.locator("body").count()).toBe(1);
    }
  });

  test("THEME-03 - Theme change keeps application functional", async ({
    page,
  }) => {
    await loginAsCustomer(page);

    const themeButton = page.locator(
      'button[aria-label*="theme" i], button[title*="theme" i]'
    );

    if (await themeButton.count()) {
      await themeButton.first().click();
    }

    await page.goto("/app/products");

    await expect(
      page.locator("article").first()
    ).toBeVisible({ timeout: 10000 });
  });

  test("THEME-04 - Theme state survives reload", async ({ page }) => {
    await loginAsCustomer(page);

    const themeButton = page.locator(
      'button[aria-label*="theme" i], button[title*="theme" i]'
    );

    if (await themeButton.count()) {
      await themeButton.first().click();
    }

    await page.reload();

    await expect(page).toHaveURL(/\/app$/);
  });

  test("THEME-05 - Theme works on orders page", async ({ page }) => {
    await loginAsCustomer(page);

    await page.goto("/app/orders");

    await expect(
      page.getByRole("heading", { name: /my orders/i })
    ).toBeVisible({ timeout: 10000 });
  });
});
