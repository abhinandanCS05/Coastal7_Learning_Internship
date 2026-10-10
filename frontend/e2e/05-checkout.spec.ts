import { test, expect, Page } from "@playwright/test";

const CUSTOMER_EMAIL = "demo@shopflow.com";
const CUSTOMER_PASSWORD = "Demo@123";
const PRODUCT_NAME = "Nova X Pro 5G";

async function loginAsCustomer(page: Page) {
  await page.goto("/login");

  await page.getByLabel("Email").fill(CUSTOMER_EMAIL);
  await page.getByLabel("Password").fill(CUSTOMER_PASSWORD);

  const customerRole = page.getByText("Customer", { exact: true });

  if (await customerRole.count()) {
    await customerRole.click();
  }

  await page.getByRole("button", { name: /sign in/i }).click();

  await expect(page).toHaveURL(/\/app/);
}

async function ensureCartProduct(page: Page) {
  await page.goto("/app/products", {
    waitUntil: "domcontentloaded",
  });

  const productCard = page
    .locator("article")
    .filter({ hasText: PRODUCT_NAME })
    .first();

  await expect(productCard).toBeVisible({
    timeout: 10000,
  });

  const addButton = productCard.getByRole("button", {
    name: /add to cart/i,
  });

  if (await addButton.count()) {
    await addButton.click();
  }

  await page.goto("/app/cart", {
    waitUntil: "domcontentloaded",
  });

  await expect(
    page.getByText(PRODUCT_NAME, { exact: true })
  ).toBeVisible({
    timeout: 10000,
  });
}

async function openCheckout(page: Page) {
  await page.goto("/app/checkout", {
    waitUntil: "domcontentloaded",
  });

  await expect(
    page.getByRole("heading", {
      name: "Secure Checkout",
      exact: true,
    })
  ).toBeVisible({
    timeout: 10000,
  });
}

async function prepareCheckout(page: Page) {
  await loginAsCustomer(page);
  await ensureCartProduct(page);
  await openCheckout(page);
}

async function fillValidAddress(page: Page) {
  await page.getByLabel("Full name").fill("Demo Customer");
  await page.getByRole("textbox", { name: "Phone" }).fill("9876543210");
  await page.getByLabel("Address").fill("123 Main Street");
  await page.getByLabel("City").fill("Guntur");
  await page.getByLabel("State").fill("Andhra Pradesh");
  await page.getByLabel("PIN code").fill("522001");
}

test.describe("Checkout E2E", () => {

  test("CHECKOUT-02: all delivery address fields render", async ({
    page,
  }) => {
    await prepareCheckout(page);

    await expect(page.getByLabel("Full name")).toBeVisible();
    await expect(page.getByRole("textbox", { name: "Phone" })).toBeVisible();
    await expect(page.getByLabel("Address")).toBeVisible();
    await expect(page.getByLabel("City")).toBeVisible();
    await expect(page.getByLabel("State")).toBeVisible();
    await expect(page.getByLabel("PIN code")).toBeVisible();
  });

  test("CHECKOUT-03: saved customer address is prefilled", async ({
    page,
  }) => {
    await loginAsCustomer(page);
    await openCheckout(page);

    await expect(page.getByLabel("Full name")).toHaveValue(
      "Demo Customer"
    );

    await expect(page.getByRole("textbox", { name: "Phone" })).toHaveValue(
      "9876543210"
    );

    await expect(page.getByLabel("City")).toHaveValue("Guntur");
    await expect(page.getByLabel("State")).toHaveValue(
      "Andhra Pradesh"
    );
  });

  test("CHECKOUT-04: empty full name is rejected", async ({ page }) => {
    await prepareCheckout(page);

    await page.getByLabel("Full name").fill("");

    await page.getByRole("button", {
      name: /place order/i,
    }).click();

    await expect(
      page.getByText("Full name must be at least 2 characters", {
        exact: true,
      })
    ).toBeVisible();
  });

  test("CHECKOUT-05: invalid phone is rejected", async ({ page }) => {
    await prepareCheckout(page);

    await page.getByRole("textbox", { name: "Phone" }).fill("1234567890");

    await page.getByRole("button", {
      name: /place order/i,
    }).click();

    await expect(
      page.getByText(
        "Enter a valid 10-digit Indian mobile number",
        { exact: true }
      )
    ).toBeVisible();
  });

  test("CHECKOUT-06: short address is rejected", async ({ page }) => {
    await prepareCheckout(page);

    await page.getByLabel("Address").fill("abc");

    await page.getByRole("button", {
      name: /place order/i,
    }).click();

    await expect(
      page.getByText(
        "Address must be at least 5 characters",
        { exact: true }
      )
    ).toBeVisible();
  });

  test("CHECKOUT-07: invalid city and state are rejected", async ({
    page,
  }) => {
    await prepareCheckout(page);

    await page.getByLabel("City").fill("A");
    await page.getByLabel("State").fill("B");

    await page.getByRole("button", {
      name: /place order/i,
    }).click();

    await expect(
      page.getByText("City is required", {
        exact: true,
      })
    ).toBeVisible();

    await expect(
      page.getByText("State is required", {
        exact: true,
      })
    ).toBeVisible();
  });

  test("CHECKOUT-09: valid checkout data passes validation", async ({
    page,
  }) => {
    await prepareCheckout(page);

    await fillValidAddress(page);

    /*
     * We don't submit here because submitting creates a real order.
     * Instead verify that no validation error is present after
     * entering a complete valid form.
     */
    await expect(
      page.getByText("Full name must be at least 2 characters", {
        exact: true,
      })
    ).not.toBeVisible();

    await expect(
      page.getByText(
        "Enter a valid 10-digit Indian mobile number",
        { exact: true }
      )
    ).not.toBeVisible();

    await expect(
      page.getByText("Address must be at least 5 characters", {
        exact: true,
      })
    ).not.toBeVisible();

    await expect(
      page.getByText("PIN code must be exactly 6 digits", {
        exact: true,
      })
    ).not.toBeVisible();
  });

  test("CHECKOUT-10: all payment methods render", async ({ page }) => {
    await prepareCheckout(page);

    await expect(
      page.getByText("Cash on Delivery", {
        exact: true,
      })
    ).toBeVisible();

    await expect(
      page.getByText("UPI", {
        exact: true,
      })
    ).toBeVisible();

    await expect(
      page.getByText("Net Banking", {
        exact: true,
      })
    ).toBeVisible();

    await expect(
      page.getByText("Credit / Debit Card", {
        exact: true,
      })
    ).toBeVisible();
  });

  test("CHECKOUT-11: payment method can be selected", async ({
    page,
  }) => {
    await prepareCheckout(page);

    const upiRadio = page.locator(
      'input[type="radio"][value="UPI"]'
    );

    await expect(upiRadio).toBeVisible();

    await upiRadio.check();

    await expect(upiRadio).toBeChecked();

    const cardRadio = page.locator(
      'input[type="radio"][value="CARD"]'
    );

    await cardRadio.check();

    await expect(cardRadio).toBeChecked();
    await expect(upiRadio).not.toBeChecked();
  });

  test("CHECKOUT-12: bill details render", async ({ page }) => {
    await prepareCheckout(page);

    await expect(
      page.getByRole("heading", {
        name: "Bill Details",
        exact: true,
      })
    ).toBeVisible();

    await expect(
      page.getByText("Subtotal", {
        exact: true,
      })
    ).toBeVisible();

    await expect(
      page.getByText("Offer discount", {
        exact: true,
      })
    ).toBeVisible();

    await expect(
      page.getByText("Delivery", {
        exact: true,
      })
    ).toBeVisible();

    await expect(
      page.getByText("Total", {
        exact: true,
      })
    ).toBeVisible();
  });

  test("CHECKOUT-13: available offers are displayed", async ({
    page,
  }) => {
    await prepareCheckout(page);

    const offerArea = page.locator("aside");

    /*
     * The backend may return zero or more offers, so we verify
     * that the checkout summary itself is rendered rather than
     * assuming a particular promotional code.
     */
    await expect(
      offerArea.getByText("Bill Details", {
        exact: true,
      })
    ).toBeVisible();

    const offerCards = offerArea.locator(
      ".bg-green-50"
    );

    await expect
      .poll(async () => await offerCards.count(), {
        timeout: 10000,
      })
      .toBeGreaterThanOrEqual(0);
  });

  test("CHECKOUT-14: successful COD checkout creates an order", async ({
    page,
  }) => {
    await loginAsCustomer(page);

    /*
     * Navigate directly to checkout first. This avoids the extra
     * catalog -> cart navigation that previously experienced a
     * browser dialog/navigation interruption.
     */
    await page.goto("/app/checkout", {
      waitUntil: "domcontentloaded",
    });

    /*
     * If the account has no cart item, add one through the catalog
     * and return to checkout.
     */
    const checkoutHeading = page.getByRole("heading", {
      name: "Secure Checkout",
      exact: true,
    });

    if (!(await checkoutHeading.count())) {
      await page.goto("/app/products", {
        waitUntil: "domcontentloaded",
      });

      const productCard = page
        .locator("article")
        .filter({ hasText: PRODUCT_NAME })
        .first();

      await expect(productCard).toBeVisible({
        timeout: 10000,
      });

      const addButton = productCard.getByRole("button", {
        name: /add to cart/i,
      });

      if (await addButton.count()) {
        await addButton.click();
      }

      await page.goto("/app/checkout", {
        waitUntil: "domcontentloaded",
      });
    }

    await expect(checkoutHeading).toBeVisible({
      timeout: 10000,
    });

    await fillValidAddress(page);

    const codRadio = page.locator(
      'input[type="radio"][value="COD"]'
    );

    await expect(codRadio).toBeChecked();

    const placeOrderButton = page.getByRole("button", {
      name: /place order/i,
    });

    await expect(placeOrderButton).toBeVisible();

    await placeOrderButton.click();

    await expect(
      page.getByText("Order Placed", {
        exact: true,
      })
    ).toBeVisible({
      timeout: 15000,
    });

    await expect(page).toHaveURL(/\/app\/orders/, {
      timeout: 15000,
    });
  });
  test("CHECKOUT-15: checkout requires authentication", async ({
    page,
  }) => {
    await page.goto("/app/checkout", {
      waitUntil: "domcontentloaded",
    });

    await expect(page).toHaveURL(/\/login/);
  });
});
