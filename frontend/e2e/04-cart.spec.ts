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

async function openCart(page: Page) {
  await page.goto("/app/cart");

  await expect(
    page.getByRole("heading", { name: "Shopping Cart", exact: true })
  ).toBeVisible({ timeout: 10000 });
}

async function addProductToCart(
  page: Page,
  productName = PRODUCT_NAME
) {
  await page.goto("/app/products");

  const productCard = page
    .locator("article")
    .filter({ hasText: productName })
    .first();

  await expect(productCard).toBeVisible({ timeout: 10000 });

  const addButton = productCard.getByRole("button", {
    name: /add to cart/i,
  });

  if (await addButton.count()) {
    await addButton.click();
  }

  await page.goto("/app/cart");

  await expect(
    page.getByText(productName, { exact: true })
  ).toBeVisible({ timeout: 10000 });
}

function getCartItem(page: Page, productName = PRODUCT_NAME) {
  return page
    .locator("section")
    .locator("div")
    .filter({ hasText: productName })
    .last();
}

test.describe("Cart E2E", () => {
  test("CART-01: cart page loads", async ({ page }) => {
    await loginAsCustomer(page);
    await openCart(page);

    await expect(
      page.getByRole("heading", { name: "Shopping Cart", exact: true })
    ).toBeVisible();
  });

  test("CART-02: cart handles empty or existing state", async ({ page }) => {
    await loginAsCustomer(page);
    await page.goto("/app/cart");

    const emptyState = page.getByText("Your cart is empty", {
      exact: true,
    });

    const shoppingCartHeading = page.getByRole("heading", {
      name: "Shopping Cart",
      exact: true,
    });

    await expect
      .poll(async () => {
        return (
          (await emptyState.count()) > 0 ||
          (await shoppingCartHeading.count()) > 0
        );
      })
      .toBeTruthy();
  });

  test("CART-03: product can be added to cart from catalog", async ({
    page,
  }) => {
    await loginAsCustomer(page);

    await addProductToCart(page);

    await expect(
      page.getByText(PRODUCT_NAME, { exact: true })
    ).toBeVisible();
  });

  test("CART-04: added product appears in cart", async ({ page }) => {
    await loginAsCustomer(page);

    await addProductToCart(page);

    await openCart(page);

    const productLink = page
      .locator('a[href^="/app/products/"]')
      .filter({ hasText: PRODUCT_NAME })
      .first();

    await expect(productLink).toBeVisible({
      timeout: 10000,
    });
  });

  test("CART-05: product quantity can be increased", async ({ page }) => {
    await loginAsCustomer(page);

    await addProductToCart(page);
    await openCart(page);

    const productItem = getCartItem(page);

    await expect(productItem).toBeVisible({
      timeout: 10000,
    });

    const buttons = productItem.getByRole("button");

    await expect(buttons).toHaveCount(3);

    const plusButton = buttons.nth(1);
    const quantity = productItem.locator("span").filter({
      hasText: /^\d+$/,
    });

    const initialQuantity = await quantity.textContent();

    await plusButton.click();

    await expect
      .poll(async () => await quantity.textContent(), {
        timeout: 10000,
      })
      .not.toBe(initialQuantity);
  });

  test("CART-06: product quantity can be decreased", async ({ page }) => {
    await loginAsCustomer(page);

    await addProductToCart(page);
    await openCart(page);

    const productItem = getCartItem(page);

    await expect(productItem).toBeVisible({
      timeout: 10000,
    });

    const buttons = productItem.getByRole("button");

    await expect(buttons).toHaveCount(3);

    const minusButton = buttons.nth(0);
    const plusButton = buttons.nth(1);

    const quantity = productItem.locator("span").filter({
      hasText: /^\d+$/,
    });

    /*
     * First move deterministically from quantity 1 -> 2.
     */
    await plusButton.click();

    await expect
      .poll(async () => (await quantity.textContent())?.trim(), {
        timeout: 10000,
      })
      .toBe("2");

    /*
     * Then move deterministically from quantity 2 -> 1.
     */
    await minusButton.click();

    await expect
      .poll(async () => (await quantity.textContent())?.trim(), {
        timeout: 10000,
      })
      .toBe("1");
  });

  test("CART-08: cart supports multiple products", async ({ page }) => {
    await loginAsCustomer(page);

    await page.goto("/app/products", {
      waitUntil: "domcontentloaded",
    });

    const cards = page.locator("article");

    await expect(cards.first()).toBeVisible({
      timeout: 10000,
    });

    /*
     * Find two different product cards.
     * We deliberately do not extract their text because product
     * cards can contain badges such as "Limited Stock" and
     * stock messages such as "Only 6 left".
     */

    const firstCard = cards.first();

    const firstProductLink = firstCard.locator(
      'a[href^="/app/products/"]'
    ).first();

    await expect(firstProductLink).toBeVisible({
      timeout: 10000,
    });

    const firstProductHref = await firstProductLink.getAttribute("href");

    expect(firstProductHref).toBeTruthy();

    const firstAddButton = firstCard.getByRole("button", {
      name: /add to cart/i,
    });

    if (await firstAddButton.count()) {
      await firstAddButton.click();
    }

    const secondCard = cards
      .filter({
        has: page.locator(
          `a[href^="/app/products/"]:not([href="${firstProductHref}"])`
        ),
      })
      .first();

    await expect(secondCard).toBeVisible({
      timeout: 10000,
    });

    const secondProductLink = secondCard.locator(
      'a[href^="/app/products/"]'
    ).first();

    await expect(secondProductLink).toBeVisible({
      timeout: 10000,
    });

    const secondProductHref = await secondProductLink.getAttribute("href");

    expect(secondProductHref).toBeTruthy();
    expect(secondProductHref).not.toBe(firstProductHref);

    const secondAddButton = secondCard.getByRole("button", {
      name: /add to cart/i,
    });

    if (await secondAddButton.count()) {
      await secondAddButton.click();
    }

    await page.goto("/app/cart", {
      waitUntil: "domcontentloaded",
    });

    await expect(
      page.getByRole("heading", {
        name: "Shopping Cart",
        exact: true,
      })
    ).toBeVisible({
      timeout: 10000,
    });

    /*
     * Verify that the cart contains at least two product links.
     * We don't require exactly two because the demo account
     * intentionally retains cart state between tests.
     */
    const cartProducts = page.locator(
      'section a[href^="/app/products/"]'
    );

    await expect
      .poll(async () => await cartProducts.count(), {
        timeout: 10000,
      })
      .toBeGreaterThanOrEqual(2);

    const cartHrefs = await cartProducts.evaluateAll(
      (links) => links.map((link) => link.getAttribute("href"))
    );

    const uniqueCartProducts = new Set(cartHrefs.filter(Boolean));

    expect(uniqueCartProducts.size).toBeGreaterThanOrEqual(2);
  });
  test("CART-09: cart state persists after reload", async ({ page }) => {
    await loginAsCustomer(page);

    await addProductToCart(page);
    await openCart(page);

    await expect(
      page.getByText(PRODUCT_NAME, { exact: true })
    ).toBeVisible();

    await page.reload();

    await expect(
      page.getByRole("heading", {
        name: "Shopping Cart",
        exact: true,
      })
    ).toBeVisible({ timeout: 10000 });

    await expect(
      page.getByText(PRODUCT_NAME, { exact: true })
    ).toBeVisible({ timeout: 10000 });
  });

  test("CART-10: order summary displays correctly", async ({ page }) => {
    await loginAsCustomer(page);

    await addProductToCart(page);
    await openCart(page);

    await expect(
      page.getByRole("heading", {
        name: "Order Summary",
        exact: true,
      })
    ).toBeVisible();

    await expect(page.getByText("Subtotal", { exact: true })).toBeVisible();

    await expect(
      page.getByText("Offer discount", { exact: true })
    ).toBeVisible();

    await expect(
      page.getByText("Delivery", { exact: true })
    ).toBeVisible();

    await expect(page.getByText("Total", { exact: true })).toBeVisible();
  });

  test("CART-11: cart proceeds to checkout", async ({ page }) => {
    await loginAsCustomer(page);

    await addProductToCart(page);
    await openCart(page);

    const checkoutButton = page.getByRole("button", {
      name: /proceed to checkout/i,
    });

    await expect(checkoutButton).toBeVisible();

    await checkoutButton.click();

    await expect(page).toHaveURL(/\/app\/checkout/);
  });

  test("CART-12: cart product opens product details", async ({ page }) => {
    await loginAsCustomer(page);

    await addProductToCart(page);
    await openCart(page);

    const productLink = page
      .locator('a[href^="/app/products/"]')
      .filter({ hasText: PRODUCT_NAME })
      .first();

    await expect(productLink).toBeVisible({
      timeout: 10000,
    });

    await productLink.click();

    await expect(page).toHaveURL(/\/app\/products\/\d+/);
  });
});
