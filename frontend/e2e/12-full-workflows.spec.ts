import { test, expect } from "@playwright/test";

const ADMIN_EMAIL = "admin@shopflow.com";
const ADMIN_PASSWORD = "Admin@123";
const CUSTOMER_EMAIL = "demo@shopflow.com";
const CUSTOMER_PASSWORD = "Demo@123";

async function loginAsCustomer(page: any) {
  await page.goto("/login");
  await page.getByLabel("Email").fill(CUSTOMER_EMAIL);
  await page.getByLabel("Password").fill(CUSTOMER_PASSWORD);
  await page.getByText("Customer", { exact: true }).click();
  await page.getByRole("button", { name: /sign in/i }).click();
  await expect(page).toHaveURL(/\/app$/, { timeout: 10000 });
}

async function loginAsAdmin(page: any) {
  await page.goto("/login");
  await page.getByLabel("Email").fill(ADMIN_EMAIL);
  await page.getByLabel("Password").fill(ADMIN_PASSWORD);
  await page.getByText("Admin", { exact: true }).click();
  await page.getByRole("button", { name: /sign in/i }).click();
  await expect(page).toHaveURL(/\/app\/admin$/, { timeout: 10000 });
}

test.describe("Full ShopFlow E2E", () => {
  test("FULL-01 - Customer login and product discovery", async ({ page }) => {
    await loginAsCustomer(page);

    await page.goto("/app/products");

    await expect(
      page.locator("article").first()
    ).toBeVisible({ timeout: 10000 });
  });

  test("FULL-02 - Product details workflow", async ({ page }) => {
    await loginAsCustomer(page);

    await page.goto("/app/products");

    const product = page.locator(
      'a[href*="/app/products/"]'
    ).first();

    await expect(product).toBeVisible({ timeout: 10000 });
    await product.click();

    await expect(page).toHaveURL(/\/app\/products\/\d+/);
  });

  test("FULL-03 - Cart workflow", async ({ page }) => {
    await loginAsCustomer(page);

    await page.goto("/app/products");

    const add = page.getByRole("button", {
      name: /add to cart/i,
    }).first();

    await expect(add).toBeVisible({ timeout: 10000 });
    await add.click();

    await page.goto("/app/cart");

    await expect(page).toHaveURL(/\/app\/cart/);
  });

  test("FULL-04 - Checkout workflow", async ({ page }) => {
    await loginAsCustomer(page);

    await page.goto("/app/checkout");

    await expect(
      page.getByRole("heading", { name: /checkout/i })
    ).toBeVisible({ timeout: 10000 });
  });

  test("FULL-05 - Order history workflow", async ({ page }) => {
    await loginAsCustomer(page);

    await page.goto("/app/orders");

    await expect(
      page.getByRole("heading", { name: /my orders/i })
    ).toBeVisible({ timeout: 10000 });
  });

  test("FULL-06 - Wishlist workflow", async ({ page }) => {
    await loginAsCustomer(page);

    await page.goto("/app/wishlist");

    await expect(
      page.getByRole("heading", { name: /wishlist/i })
    ).toBeVisible({ timeout: 10000 });
  });

  test("FULL-07 - Admin product management workflow", async ({ page }) => {
    await loginAsAdmin(page);

    await page.goto("/app/admin");

    await expect(
      page.getByText("Product Management", { exact: true })
    ).toBeVisible();

    await page.getByTitle("Edit product").first().click();

    await expect(
      page.getByRole("heading", { name: /edit product/i })
    ).toBeVisible();
  });

  test("FULL-08 - Admin order management workflow", async ({ page }) => {
    await loginAsAdmin(page);

    await page.goto("/app/admin");

    await expect(
      page.getByText("Live Order Command Center", { exact: true })
    ).toBeVisible();
  });

  test("FULL-09 - Customer session survives reload", async ({ page }) => {
    await loginAsCustomer(page);

    await page.goto("/app");

    await page.reload();

    await expect(page).toHaveURL(/\/app$/);
  });

  test("FULL-10 - Admin session survives reload", async ({ page }) => {
    await loginAsAdmin(page);

    await page.goto("/app/admin");

    await page.reload();

    await expect(
      page.getByRole("heading", {
        name: /shopflow admin command center/i,
      })
    ).toBeVisible({ timeout: 10000 });
  });
});
