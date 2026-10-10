import { test, expect } from "@playwright/test";

const CUSTOMER_EMAIL = "demo@shopflow.com";
const CUSTOMER_PASSWORD = "Demo@123";

const ADMIN_EMAIL = "admin@shopflow.com";
const ADMIN_PASSWORD = "Admin@123";

test.describe("Authentication - Customer Login", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("AUTH-01: login page renders correctly", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /welcome back/i })
    ).toBeVisible();

    await expect(page.getByText("Customer", { exact: true })).toBeVisible();
    await expect(page.getByText("Admin", { exact: true })).toBeVisible();

    await expect(
      page.getByRole("button", { name: /sign in/i })
    ).toBeVisible();

    await expect(page.getByText(/demo customer/i)).toBeVisible();
    await expect(page.getByText(/demo admin/i)).toBeVisible();
  });

  test("AUTH-02: customer can login with valid credentials", async ({
    page,
  }) => {
    await page.getByLabel("Email").fill(CUSTOMER_EMAIL);
    await page.getByLabel("Password").fill(CUSTOMER_PASSWORD);

    await page.getByText("Customer", { exact: true }).click();

    await page.getByRole("button", { name: /sign in/i }).click();

    await expect(page).toHaveURL(/\/app$/);
  });

  test("AUTH-03: admin can login with valid credentials", async ({ page }) => {
    await page.getByLabel("Email").fill(ADMIN_EMAIL);
    await page.getByLabel("Password").fill(ADMIN_PASSWORD);

    await page.getByText("Admin", { exact: true }).click();

    await page.getByRole("button", { name: /sign in/i }).click();

    await expect(page).toHaveURL(/\/app\/admin$/);
  });

  test("AUTH-04: incorrect password is rejected", async ({ page }) => {
    await page.getByLabel("Email").fill(CUSTOMER_EMAIL);
    await page.getByLabel("Password").fill("WrongPassword123!");

    await page.getByText("Customer", { exact: true }).click();
    await page.getByRole("button", { name: /sign in/i }).click();

    await expect(page).toHaveURL(/\/login/);

    await expect(
      page.getByText(/invalid email or password/i)
    ).toBeVisible();
  });

  test("AUTH-05: unknown email is rejected", async ({ page }) => {
    await page.getByLabel("Email").fill("unknown-user@shopflow.com");
    await page.getByLabel("Password").fill("Demo@123");

    await page.getByText("Customer", { exact: true }).click();
    await page.getByRole("button", { name: /sign in/i }).click();

    await expect(page).toHaveURL(/\/login/);

    await expect(
      page.getByText(/invalid email or password/i)
    ).toBeVisible();
  });

  test("AUTH-06: empty email does not authenticate", async ({ page }) => {
    await page.getByLabel("Email").fill("");
    await page.getByLabel("Password").fill(CUSTOMER_PASSWORD);

    await page.getByText("Customer", { exact: true }).click();
    await page.getByRole("button", { name: /sign in/i }).click();

    await expect(page).toHaveURL(/\/login/);
    await expect(page).not.toHaveURL(/\/app/);
  });

  test("AUTH-07: empty password is rejected", async ({ page }) => {
    await page.getByLabel("Email").fill(CUSTOMER_EMAIL);
    await page.getByLabel("Password").fill("");

    await page.getByRole("button", { name: /sign in/i }).click();

    await expect(page).toHaveURL(/\/login/);

    await expect(
      page.locator(".bg-red-50")
    ).toBeVisible();
  });

  test("AUTH-08: empty email and password do not authenticate", async ({
    page,
  }) => {
    await page.getByLabel("Email").fill("");
    await page.getByLabel("Password").fill("");

    await page.getByText("Customer", { exact: true }).click();
    await page.getByRole("button", { name: /sign in/i }).click();

    await expect(page).toHaveURL(/\/login/);
    await expect(page).not.toHaveURL(/\/app/);
  });

  test("AUTH-09: customer credentials cannot login as admin", async ({
    page,
  }) => {
    await page.getByLabel("Email").fill(CUSTOMER_EMAIL);
    await page.getByLabel("Password").fill(CUSTOMER_PASSWORD);

    await page.getByText("Admin", { exact: true }).click();

    await page.getByRole("button", { name: /sign in/i }).click();

    await expect(page).toHaveURL(/\/login/);

    await expect(
      page.getByText(/selected role does not match account/i)
    ).toBeVisible();
  });

  test("AUTH-10: admin credentials cannot login as customer", async ({
    page,
  }) => {
    await page.getByLabel("Email").fill(ADMIN_EMAIL);
    await page.getByLabel("Password").fill(ADMIN_PASSWORD);

    await page.getByText("Customer", { exact: true }).click();

    await page.getByRole("button", { name: /sign in/i }).click();

    await expect(page).toHaveURL(/\/login/);

    await expect(
      page.getByText(/selected role does not match account/i)
    ).toBeVisible();
  });

  test("AUTH-11: password visibility toggle works", async ({ page }) => {
    const password = page.getByLabel("Password");

    await password.fill(CUSTOMER_PASSWORD);

    await expect(password).toHaveAttribute("type", "password");

    const toggle = password.locator("..").getByRole("button");

    await toggle.click();

    await expect(password).toHaveAttribute("type", "text");
  });

  test("AUTH-12: customer can navigate to registration page", async ({
    page,
  }) => {
    await page.getByRole("link", { name: /create account/i }).click();

    await expect(page).toHaveURL(/\/register/);

    await expect(
      page.getByRole("heading", { name: /create your account/i })
    ).toBeVisible();
  });
});


test.describe("Authentication - Registration Form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/register");
  });

  test("AUTH-13: registration form renders correctly", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /create your account/i })
    ).toBeVisible();

    await expect(page.getByLabel("Full name")).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();

    await expect(
      page.getByRole("button", { name: /create account/i })
    ).toBeVisible();
  });

  test("AUTH-14: required validation prevents empty registration", async ({
    page,
  }) => {
    await page.getByRole("button", { name: /create account/i }).click();

    await expect(page).toHaveURL(/\/register/);

    await expect(page.getByLabel("Full name")).toBeFocused();
  });

  test("AUTH-15: existing users can navigate back to login", async ({
    page,
  }) => {
    await page.getByRole("link", { name: /sign in/i }).click();

    await expect(page).toHaveURL(/\/login/);

    await expect(
      page.getByRole("heading", { name: /welcome back/i })
    ).toBeVisible();
  });
});
