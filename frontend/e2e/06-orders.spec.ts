import { test, expect, Page } from "@playwright/test";

const CUSTOMER_EMAIL = "demo@shopflow.com";
const CUSTOMER_PASSWORD = "Demo@123";

async function loginAsCustomer(page: Page) {
  await page.goto("/login");

  await page.getByLabel("Email").fill(CUSTOMER_EMAIL);
  await page.getByLabel("Password").fill(CUSTOMER_PASSWORD);

  const customerRole = page.getByText("Customer", { exact: true });

  if (await customerRole.count()) {
    await customerRole.click();
  }

  await page.getByRole("button", {
    name: /sign in/i,
  }).click();

  await expect(page).toHaveURL(/\/app/);
}

async function openOrders(page: Page) {
  await page.goto("/app/orders", {
    waitUntil: "domcontentloaded",
  });

  await expect(
    page.getByRole("heading", {
      name: "My Orders",
      exact: true,
    })
  ).toBeVisible({
    timeout: 10000,
  });
}

async function prepareOrders(page: Page) {
  await loginAsCustomer(page);
  await openOrders(page);
}

function orderCards(page: Page) {
  return page
    .locator("main")
    .locator("> div")
    .last()
    .locator("> div");
}

test.describe("Order History E2E", () => {
  test("ORDER-01: orders page loads", async ({ page }) => {
    await prepareOrders(page);

    await expect(
      page.getByRole("heading", {
        name: "My Orders",
        exact: true,
      })
    ).toBeVisible();
  });

  test("ORDER-02: order history renders", async ({ page }) => {
    await prepareOrders(page);

    const emptyState = page.getByText("No orders yet.", {
      exact: true,
    });

    const orderLabels = page.getByText(/Order #\d+/);

    await expect
      .poll(
        async () =>
          (await emptyState.count()) > 0 ||
          (await orderLabels.count()) > 0,
        {
          timeout: 10000,
        }
      )
      .toBeTruthy();
  });

  test("ORDER-03: order ID and status are displayed", async ({
    page,
  }) => {
    await prepareOrders(page);

    const orderLabels = page.getByText(/Order #\d+/);

    if ((await orderLabels.count()) === 0) {
      test.skip(true, "Customer has no orders.");
    }

    await expect(orderLabels.first()).toBeVisible();

    const statuses = page.locator(
      "span.rounded-full"
    );

    await expect(statuses.first()).toBeVisible({
      timeout: 10000,
    });

    const statusText = (
      await statuses.first().textContent()
    )?.trim();

    expect(statusText).toBeTruthy();
  });

  test("ORDER-04: payment information is displayed", async ({
    page,
  }) => {
    await prepareOrders(page);

    const paymentText = page.getByText(
      /Payment:\s*/i
    );

    if ((await paymentText.count()) === 0) {
      test.skip(true, "Customer has no orders.");
    }

    await expect(paymentText.first()).toBeVisible();

    await expect(
      page.getByText(/Payment status:/i).first()
    ).toBeVisible();
  });

  test("ORDER-05: order total is displayed", async ({ page }) => {
    await prepareOrders(page);

    const paymentText = page.getByText(
      /Payment:\s*/i
    );

    if ((await paymentText.count()) === 0) {
      test.skip(true, "Customer has no orders.");
    }

    /*
     * Each order card contains a large total value.
     * Verify that at least one numeric amount exists in the
     * order section.
     */
    const orderArea = page.locator("main");

    const numericValues = orderArea.locator(
      "span.text-xl.font-black"
    );

    await expect(numericValues.first()).toBeVisible({
      timeout: 10000,
    });

    const totalText = (
      await numericValues.first().textContent()
    )?.trim();

    expect(totalText).toBeTruthy();
    expect(totalText).toMatch(/[\d,]+/);
  });

  test("ORDER-06: delivery address is displayed", async ({
    page,
  }) => {
    await prepareOrders(page);

    const addressHeading = page.getByText(
      "Delivery address",
      { exact: true }
    );

    if ((await addressHeading.count()) === 0) {
      test.skip(true, "Customer has no orders.");
    }

    await expect(addressHeading.first()).toBeVisible();

    const addressContainer = addressHeading.first().locator("..");

    await expect(addressContainer).toContainText(
      /.+/
    );
  });

  test("ORDER-07: order items and quantities are displayed", async ({
    page,
  }) => {
    await prepareOrders(page);

    const orderLabels = page.getByText(/Order #\d+/);

    if ((await orderLabels.count()) === 0) {
      test.skip(true, "Customer has no orders.");
    }

    const quantityLabels = page.getByText(
      /Qty\s+\d+/i
    );

    await expect(quantityLabels.first()).toBeVisible({
      timeout: 10000,
    });

    const quantityText = (
      await quantityLabels.first().textContent()
    )?.trim();

    expect(quantityText).toMatch(/Qty\s+\d+/i);
  });

  test("ORDER-08: order history persists after reload", async ({
    page,
  }) => {
    await prepareOrders(page);

    const beforeReload = await page
      .getByText(/Order #\d+/)
      .count();

    await page.reload();

    await expect(
      page.getByRole("heading", {
        name: "My Orders",
        exact: true,
      })
    ).toBeVisible({
      timeout: 10000,
    });

    const afterReload = await page
      .getByText(/Order #\d+/)
      .count();

    expect(afterReload).toBe(beforeReload);
  });

  test("ORDER-09: refresh orders control works", async ({
    page,
  }) => {
    await prepareOrders(page);

    const refreshButton = page.getByTitle("Refresh");

    await expect(refreshButton).toBeVisible();

    await refreshButton.click();

    await expect(
      page.getByRole("heading", {
        name: "My Orders",
        exact: true,
      })
    ).toBeVisible({
      timeout: 10000,
    });
  });

  test("ORDER-10: orders route requires authentication", async ({
    page,
  }) => {
    await page.goto("/app/orders", {
      waitUntil: "domcontentloaded",
    });

    await expect(page).toHaveURL(/\/login/);
  });
});
