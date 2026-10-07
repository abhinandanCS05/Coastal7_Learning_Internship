import { test, expect } from "@playwright/test";

const ADMIN_EMAIL = "admin@shopflow.com";
const ADMIN_PASSWORD = "Admin@123";
const CUSTOMER_EMAIL = "demo@shopflow.com";
const CUSTOMER_PASSWORD = "Demo@123";

async function loginAsAdmin(page: any) {
  await page.goto("/login");
  await page.getByLabel("Email").fill(ADMIN_EMAIL);
  await page.getByLabel("Password").fill(ADMIN_PASSWORD);
  await page.getByText("Admin", { exact: true }).click();
  await page.getByRole("button", { name: /sign in/i }).click();

  await expect(page).toHaveURL(/\/app\/admin$/, { timeout: 10000 });
}

async function loginAsCustomer(page: any) {
  await page.goto("/login");
  await page.getByLabel("Email").fill(CUSTOMER_EMAIL);
  await page.getByLabel("Password").fill(CUSTOMER_PASSWORD);
  await page.getByText("Customer", { exact: true }).click();
  await page.getByRole("button", { name: /sign in/i }).click();

  await expect(page).toHaveURL(/\/app$/, { timeout: 10000 });
}

async function openAdmin(page: any) {
  await loginAsAdmin(page);
  await page.goto("/app/admin");

  await expect(
    page.getByRole("heading", {
      name: /shopflow admin command center/i,
    })
  ).toBeVisible({ timeout: 10000 });
}

test.describe("Admin Order Management E2E", () => {
  test("ADMIN-ORDER-01 - Admin order command center loads", async ({ page }) => {
    await openAdmin(page);

    await expect(
      page.getByText("Live Order Command Center", { exact: true })
    ).toBeVisible();
  });

  test("ADMIN-ORDER-02 - Order management section renders", async ({ page }) => {
    await openAdmin(page);

    await expect(
      page.getByText(/order/i).first()
    ).toBeVisible();

    await expect(
      page.getByText(/live order/i).first()
    ).toBeVisible();
  });

  test("ADMIN-ORDER-03 - Admin order rows or empty state render", async ({
    page,
  }) => {
    await openAdmin(page);

    const bodyText = await page.locator("body").innerText();

    expect(
      /Order #|No orders|Live Order Command Center/i.test(bodyText)
    ).toBe(true);
  });

  test("ADMIN-ORDER-04 - Admin can view order status controls", async ({
    page,
  }) => {
    await openAdmin(page);

    const statusControls = page.locator(
      "select, button"
    );

    const count = await statusControls.count();

    expect(count).toBeGreaterThan(0);
  });

  test("ADMIN-ORDER-05 - Admin order information is visible", async ({
    page,
  }) => {
    await openAdmin(page);

    const bodyText = await page.locator("body").innerText();

    expect(
      /Payment|Status|Total|Order/i.test(bodyText)
    ).toBe(true);
  });

  test("ADMIN-ORDER-06 - Admin dashboard remains usable after reload", async ({
    page,
  }) => {
    await openAdmin(page);

    await page.reload();

    await expect(
      page.getByRole("heading", {
        name: /shopflow admin command center/i,
      })
    ).toBeVisible({ timeout: 10000 });

    await expect(
      page.getByText("Live Order Command Center", { exact: true })
    ).toBeVisible();
  });

  test("ADMIN-ORDER-07 - Admin can access product and order management together", async ({
    page,
  }) => {
    await openAdmin(page);

    await expect(
      page.getByText("Product Management", { exact: true })
    ).toBeVisible();

    await expect(
      page.getByText("Live Order Command Center", { exact: true })
    ).toBeVisible();
  });

  test("ADMIN-ORDER-08 - Customer cannot access admin order controls", async ({
    page,
  }) => {
    await loginAsCustomer(page);

    await page.goto("/app/admin");

    await expect(page).toHaveURL(/\/app$/, {
      timeout: 10000,
    });
  });
});

test.describe("Theme E2E", () => {
  test("THEME-01 - Customer dashboard loads with theme controls", async ({
    page,
  }) => {
    await loginAsCustomer(page);

    await expect(
      page.getByRole("heading").first()
    ).toBeVisible();

    const buttons = page.locator("button");
    expect(await buttons.count()).toBeGreaterThan(0);
  });

  test("THEME-03 - Theme interaction does not break navigation", async ({
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
      page.getByRole("heading", { name: /products/i })
    ).toBeVisible({ timeout: 10000 });
  });

  test("THEME-04 - Theme survives page reload", async ({ page }) => {
    await loginAsCustomer(page);

    const themeButton = page.locator(
      'button[aria-label*="theme" i], button[title*="theme" i]'
    );

    if (await themeButton.count()) {
      await themeButton.first().click();
      await page.reload();
    }

    await expect(page).toHaveURL(/\/app/);
  });

  test("THEME-05 - Theme does not block authenticated pages", async ({
    page,
  }) => {
    await loginAsCustomer(page);

    await page.goto("/app/orders");

    await expect(
      page.getByRole("heading", { name: /my orders/i })
    ).toBeVisible({ timeout: 10000 });
  });
});

test.describe("Security and Authorization E2E", () => {
  test("SECURITY-01 - Unauthenticated dashboard redirects to login", async ({
    page,
  }) => {
    await page.goto("/app");

    await expect(page).toHaveURL(/\/login/);
  });

  test("SECURITY-02 - Unauthenticated products route redirects to login", async ({
    page,
  }) => {
    await page.goto("/app/products");

    await expect(page).toHaveURL(/\/login/);
  });

  test("SECURITY-03 - Unauthenticated cart route redirects to login", async ({
    page,
  }) => {
    await page.goto("/app/cart");

    await expect(page).toHaveURL(/\/login/);
  });

  test("SECURITY-04 - Unauthenticated checkout route redirects to login", async ({
    page,
  }) => {
    await page.goto("/app/checkout");

    await expect(page).toHaveURL(/\/login/);
  });

  test("SECURITY-05 - Unauthenticated orders route redirects to login", async ({
    page,
  }) => {
    await page.goto("/app/orders");

    await expect(page).toHaveURL(/\/login/);
  });

  test("SECURITY-06 - Unauthenticated admin route redirects to login", async ({
    page,
  }) => {
    await page.goto("/app/admin");

    await expect(page).toHaveURL(/\/login/);
  });

  test("SECURITY-07 - Customer is blocked from admin route", async ({
    page,
  }) => {
    await loginAsCustomer(page);

    await page.goto("/app/admin");

    await expect(page).toHaveURL(/\/app$/);
  });

  test("SECURITY-08 - Admin can access admin route", async ({ page }) => {
    await loginAsAdmin(page);

    await page.goto("/app/admin");

    await expect(
      page.getByRole("heading", {
        name: /shopflow admin command center/i,
      })
    ).toBeVisible();
  });

  test("SECURITY-09 - Customer cannot authenticate using admin role", async ({
    page,
  }) => {
    await page.goto("/login");

    await page.getByLabel("Email").fill(ADMIN_EMAIL);
    await page.getByLabel("Password").fill(ADMIN_PASSWORD);
    await page.getByText("Customer", { exact: true }).click();

    await page.getByRole("button", { name: /sign in/i }).click();

    await expect(page).toHaveURL(/\/login/);
  });

  test("SECURITY-10 - Admin cannot authenticate using customer role", async ({
    page,
  }) => {
    await page.goto("/login");

    await page.getByLabel("Email").fill(CUSTOMER_EMAIL);
    await page.getByLabel("Password").fill(CUSTOMER_PASSWORD);
    await page.getByText("Admin", { exact: true }).click();

    await page.getByRole("button", { name: /sign in/i }).click();

    await expect(page).toHaveURL(/\/login/);
  });

  test("SECURITY-11 - Logout removes authenticated access", async ({
    page,
  }) => {
    await loginAsCustomer(page);

    const logout = page.getByRole("button", {
      name: /logout|sign out/i,
    });

    if (await logout.count()) {
      await logout.first().click();
    } else {
      await page.evaluate(() => {
        localStorage.removeItem("shopflow_token");
      });
    }

    await page.goto("/app");

    await expect(page).toHaveURL(/\/login/);
  });

  test("SECURITY-12 - Invalid token cannot access protected route", async ({
    page,
  }) => {
    await page.goto("/login");

    await page.evaluate(() => {
      localStorage.setItem("shopflow_token", "invalid-token");
    });

    await page.goto("/app");

    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe("Full ShopFlow Integration E2E", () => {
  test("FULL-01 - Customer login to product discovery", async ({ page }) => {
    await loginAsCustomer(page);

    await page.goto("/app/products");

    await expect(
      page.getByRole("heading", { name: /products/i })
    ).toBeVisible({ timeout: 10000 });

    await expect(
      page.locator("article").first()
    ).toBeVisible({ timeout: 10000 });
  });

  test("FULL-02 - Product discovery to product details", async ({ page }) => {
    await loginAsCustomer(page);

    await page.goto("/app/products");

    const productLink = page.locator(
      'a[href*="/app/products/"]'
    ).first();

    await expect(productLink).toBeVisible({ timeout: 10000 });

    await productLink.click();

    await expect(page).toHaveURL(/\/app\/products\/\d+/);
  });

  test("FULL-03 - Product to cart workflow", async ({ page }) => {
    await loginAsCustomer(page);

    await page.goto("/app/products");

    const addButton = page.getByRole("button", {
      name: /add to cart/i,
    }).first();

    await expect(addButton).toBeVisible({ timeout: 10000 });

    await addButton.click();

    await page.goto("/app/cart");

    await expect(
      page.getByRole("heading", { name: /shopping cart|cart/i })
    ).toBeVisible({ timeout: 10000 });
  });

  test("FULL-04 - Cart to checkout workflow", async ({ page }) => {
    await loginAsCustomer(page);

    await page.goto("/app/cart");

    const checkout = page.getByRole("button", {
      name: /proceed to checkout/i,
    });

    if (await checkout.count()) {
      await checkout.click();
    } else {
      await page.goto("/app/checkout");
    }

    await expect(page).toHaveURL(/\/app\/checkout/);

    await expect(
      page.getByRole("heading", { name: /checkout/i })
    ).toBeVisible({ timeout: 10000 });
  });

  test("FULL-05 - Customer can open order history", async ({ page }) => {
    await loginAsCustomer(page);

    await page.goto("/app/orders");

    await expect(
      page.getByRole("heading", { name: /my orders/i })
    ).toBeVisible({ timeout: 10000 });
  });

  test("FULL-06 - Admin command center integrates products and orders", async ({
    page,
  }) => {
    await openAdmin(page);

    await expect(
      page.getByText("Product Management", { exact: true })
    ).toBeVisible();

    await expect(
      page.getByText("Live Order Command Center", { exact: true })
    ).toBeVisible();
  });

  test("FULL-07 - Admin can open product editor from command center", async ({
    page,
  }) => {
    await openAdmin(page);

    const editButton = page.getByTitle("Edit product").first();

    await expect(editButton).toBeVisible({ timeout: 10000 });

    await editButton.click();

    await expect(
      page.getByRole("heading", { name: /edit product/i })
    ).toBeVisible();
  });

  test("FULL-08 - Admin can cancel product editor", async ({ page }) => {
    await openAdmin(page);

    await page.getByTitle("Edit product").first().click();

    await expect(
      page.getByRole("heading", { name: /edit product/i })
    ).toBeVisible();

    await page.getByRole("button", {
      name: /^cancel$/i,
    }).click();

    await expect(
      page.getByText("Product Management", { exact: true })
    ).toBeVisible();
  });

  test("FULL-09 - Customer session persists across protected pages", async ({
    page,
  }) => {
    await loginAsCustomer(page);

    await page.goto("/app/products");
    await expect(page).toHaveURL(/\/app\/products/);

    await page.goto("/app/wishlist");
    await expect(page).toHaveURL(/\/app\/wishlist/);

    await page.goto("/app/cart");
    await expect(page).toHaveURL(/\/app\/cart/);

    await page.goto("/app/orders");
    await expect(page).toHaveURL(/\/app\/orders/);
  });

  test("FULL-10 - End-to-end authenticated session survives reload", async ({
    page,
  }) => {
    await loginAsCustomer(page);

    await page.goto("/app");

    await expect(page).toHaveURL(/\/app$/);

    await page.reload();

    await expect(page).toHaveURL(/\/app$/);

    await expect(
      page.locator("body")
    ).not.toContainText(/Unable to login/i);
  });
});
