import { test, expect } from "@playwright/test";

const API_URL = "http://127.0.0.1:8000";

test.describe("ShopFlow E2E", () => {
  test("login page renders correctly", async ({ page }) => {
    await page.goto("/login");

    await expect(page.getByText("Welcome back")).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();

    await expect(
      page.getByRole("button", { name: "Customer", exact: true })
    ).toBeVisible();

    await expect(
      page.getByRole("button", { name: "Sign In", exact: true })
    ).toBeVisible();
  });

  test("ShopFlow backend health is available", async ({ request }) => {
    const response = await request.get(`${API_URL}/health`);

    expect(response.ok()).toBeTruthy();

    const data = await response.json();

    expect(data.status).toBe("ok");
    expect(data.service).toBe("ShopFlow API");
    expect(data.products).toBeGreaterThan(0);
  });

  test("customer authentication API returns access token", async ({
    request,
  }) => {
    const response = await request.post(`${API_URL}/auth/login`, {
      data: {
        email: "demo@shopflow.com",
        password: "Demo@123",
        role: "user",
      },
    });

    expect(response.ok()).toBeTruthy();

    const data = await response.json();

    expect(data.access_token).toBeTruthy();
    expect(data.email).toBe("demo@shopflow.com");
    expect(data.role).toBe("user");
  });
});
