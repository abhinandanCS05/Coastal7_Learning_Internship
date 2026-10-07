import { test, expect } from "@playwright/test";

const CUSTOMER_EMAIL = "demo@shopflow.com";
const CUSTOMER_PASSWORD = "Demo@123";

const ADMIN_EMAIL = "admin@shopflow.com";
const ADMIN_PASSWORD = "Admin@123";

async function openLogin(page: any) {
  await page.goto("/login");
  await expect(page).toHaveURL(/\/login$/);
}

async function selectRole(page: any, role: "Customer" | "Admin") {
  await page.getByText(role, { exact: true }).click();
}

async function submitLogin(
  page: any,
  email: string,
  password: string,
  role: "Customer" | "Admin"
) {
  await openLogin(page);

  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await selectRole(page, role);

  await page.getByRole("button", { name: /sign in/i }).click();
}

async function loginAsAdmin(page: any) {
  await submitLogin(
    page,
    ADMIN_EMAIL,
    ADMIN_PASSWORD,
    "Admin"
  );

  await expect(page).toHaveURL(/\/app\/admin$/, {
    timeout: 10000,
  });
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

test.describe("Admin Authentication & Authorization E2E", () => {
  test("ADMIN-AUTH-01 - Login page renders", async ({ page }) => {
    await openLogin(page);

    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();

    await expect(
      page.getByRole("button", { name: /sign in/i })
    ).toBeVisible();
  });

  test("ADMIN-AUTH-02 - Valid admin credentials login successfully", async ({
    page,
  }) => {
    await loginAsAdmin(page);

    await expect(page).toHaveURL(/\/app$/);
  });

  test("ADMIN-AUTH-03 - Wrong admin password is rejected", async ({
    page,
  }) => {
    await submitLogin(
      page,
      ADMIN_EMAIL,
      "WrongPassword@123",
      "Admin"
    );

    await expect(page).toHaveURL(/\/login$/);
    await expect(page).not.toHaveURL(/\/app/);
  });

  test("ADMIN-AUTH-04 - Unknown admin email is rejected", async ({
    page,
  }) => {
    await submitLogin(
      page,
      "unknown-admin-shopflow@example.com",
      ADMIN_PASSWORD,
      "Admin"
    );

    await expect(page).toHaveURL(/\/login$/);
    await expect(page).not.toHaveURL(/\/app/);
  });

  test("ADMIN-AUTH-05 - Admin credentials cannot login as Customer", async ({
    page,
  }) => {
    await submitLogin(
      page,
      ADMIN_EMAIL,
      ADMIN_PASSWORD,
      "Customer"
    );

    await expect(page).toHaveURL(/\/login$/);
    await expect(page).not.toHaveURL(/\/app/);
  });

  test("ADMIN-AUTH-06 - Customer credentials cannot login as Admin", async ({
    page,
  }) => {
    await submitLogin(
      page,
      CUSTOMER_EMAIL,
      CUSTOMER_PASSWORD,
      "Admin"
    );

    await expect(page).toHaveURL(/\/login$/);
    await expect(page).not.toHaveURL(/\/app/);
  });

  test("ADMIN-AUTH-07 - Empty email does not authenticate", async ({
    page,
  }) => {
    await openLogin(page);

    await page.getByLabel("Email").fill("");
    await page.getByLabel("Password").fill(ADMIN_PASSWORD);
    await page.getByText("Admin", { exact: true }).click();

    await page.getByRole("button", { name: /sign in/i }).click();

    await expect(page).toHaveURL(/\/login$/);
  });

  test("ADMIN-AUTH-08 - Empty password does not authenticate", async ({
    page,
  }) => {
    await openLogin(page);

    await page.getByLabel("Email").fill(ADMIN_EMAIL);
    await page.getByLabel("Password").fill("");
    await page.getByText("Admin", { exact: true }).click();

    await page.getByRole("button", { name: /sign in/i }).click();

    await expect(page).toHaveURL(/\/login$/);
  });

  test("ADMIN-AUTH-09 - Admin can access Admin Command Center", async ({
    page,
  }) => {
    await openAdmin(page);

    await expect(
      page.getByText("Operations / Administration", {
        exact: true,
      })
    ).toBeVisible();

    await expect(
      page.getByText("Product Management", {
        exact: true,
      })
    ).toBeVisible();

    await expect(
      page.getByText("Live Order Command Center", {
        exact: true,
      })
    ).toBeVisible();
  });

  test("ADMIN-AUTH-10 - Customer cannot access Admin Command Center", async ({
    page,
  }) => {
    await submitLogin(
      page,
      CUSTOMER_EMAIL,
      CUSTOMER_PASSWORD,
      "Customer"
    );

    await expect(page).toHaveURL(/\/app$/, {
      timeout: 10000,
    });

    await page.goto("/app/admin");

    await expect(page).toHaveURL(/\/app$/);

    await expect(
      page.getByText("ShopFlow Admin Command Center", {
        exact: true,
      })
    ).not.toBeVisible();
  });

  test("ADMIN-AUTH-11 - Admin logout protects Admin dashboard", async ({
    page,
  }) => {
    await openAdmin(page);

    const logoutButton = page.getByRole("button", {
      name: /logout|sign out/i,
    });

    await expect(logoutButton).toBeVisible();

    await logoutButton.click();

    await expect(page).toHaveURL(/\/login$/);

    await page.goto("/app/admin");

    await expect(page).toHaveURL(/\/login$/);
  });

  test("ADMIN-AUTH-12 - Admin session persists after page reload", async ({
    page,
  }) => {
    await openAdmin(page);

    await page.reload();

    await expect(
      page.getByText("ShopFlow Admin Command Center", {
        exact: true,
      })
    ).toBeVisible({ timeout: 10000 });

    await expect(
      page.getByText("Product Management", {
        exact: true,
      })
    ).toBeVisible();
  });
});
