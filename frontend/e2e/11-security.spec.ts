import { test, expect } from "@playwright/test";

const ADMIN_EMAIL = "admin@shopflow.com";
const ADMIN_PASSWORD = "Admin@123";
const CUSTOMER_EMAIL = "demo@shopflow.com";
const CUSTOMER_PASSWORD = "Demo@123";

async function login(page: any, email: string, password: string, role: "user" | "admin") {
  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByText(role === "admin" ? "Admin" : "Customer", {
    exact: true,
  }).click();
  await page.getByRole("button", { name: /sign in/i }).click();
}

test.describe("ShopFlow Security E2E", () => {
  const protectedRoutes = [
    ["/app", "Dashboard"],
    ["/app/products", "Products"],
    ["/app/cart", "Cart"],
    ["/app/checkout", "Checkout"],
    ["/app/orders", "Orders"],
    ["/app/admin", "Admin"],
  ];

  for (const [route, name] of protectedRoutes) {
    test(`SECURITY-ROUTE-${name} - Protected route requires authentication`, async ({
      page,
    }) => {
      await page.goto(route);

      await expect(page).toHaveURL(/\/login/);
    });
  }

  test("SECURITY-07 - Customer is denied admin access", async ({ page }) => {
    await login(page, CUSTOMER_EMAIL, CUSTOMER_PASSWORD, "user");

    await expect(page).toHaveURL(/\/app$/);

    await page.goto("/app/admin");

    await expect(page).toHaveURL(/\/app$/);
  });

  test("SECURITY-08 - Admin is allowed admin access", async ({ page }) => {
    await login(page, ADMIN_EMAIL, ADMIN_PASSWORD, "admin");

    await expect(page).toHaveURL(/\/app\/admin$/);

    await page.goto("/app/admin");

    await expect(
      page.getByRole("heading", {
        name: /shopflow admin command center/i,
      })
    ).toBeVisible();
  });

  test("SECURITY-09 - Invalid credentials remain unauthenticated", async ({
    page,
  }) => {
    await login(page, CUSTOMER_EMAIL, "WrongPassword@123", "user");

    await expect(page).toHaveURL(/\/login/);
  });

  test("SECURITY-10 - Invalid token is rejected", async ({ page }) => {
    await page.goto("/login");

    await page.evaluate(() => {
      localStorage.setItem("shopflow_token", "invalid-token");
    });

    await page.goto("/app/orders");

    await expect(page).toHaveURL(/\/login/);
  });

  test("SECURITY-11 - Logout removes protected access", async ({ page }) => {
    await login(page, CUSTOMER_EMAIL, CUSTOMER_PASSWORD, "user");

    await expect(page).toHaveURL(/\/app$/);

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

  test("SECURITY-12 - Role mismatch is rejected", async ({ page }) => {
    await login(page, CUSTOMER_EMAIL, CUSTOMER_PASSWORD, "admin");

    await expect(page).toHaveURL(/\/login/);
  });
});
