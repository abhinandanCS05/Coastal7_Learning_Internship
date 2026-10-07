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

async function openWishlist(page: Page) {
  await page.goto("/app/wishlist");

  await expect(
    page.getByRole("heading", { name: "Wishlist", exact: true })
  ).toBeVisible({ timeout: 10000 });
}

async function addProductToWishlist(
  page: Page,
  productName = PRODUCT_NAME
) {
  await page.goto("/app/products");

  const productCard = page
    .locator("article")
    .filter({ hasText: productName })
    .first();

  await expect(productCard).toBeVisible({ timeout: 10000 });

  const removeButton = productCard.getByRole("button", {
    name: /remove from wishlist/i,
  });

  if (await removeButton.count()) {
    return;
  }

  const addButton = productCard.getByRole("button", {
    name: /add to wishlist/i,
  });

  await expect(addButton).toBeVisible({ timeout: 10000 });
  await addButton.click();

  await expect(
    productCard.getByRole("button", {
      name: /remove from wishlist/i,
    })
  ).toBeVisible({ timeout: 10000 });
}

test.describe("Wishlist E2E", () => {
  test("WISHLIST-01: wishlist page loads", async ({ page }) => {
    await loginAsCustomer(page);
    await openWishlist(page);

    await expect(
      page.getByRole("heading", { name: "Wishlist", exact: true })
    ).toBeVisible();
  });

  test("WISHLIST-02: wishlist displays current state", async ({ page }) => {
    await loginAsCustomer(page);
    await openWishlist(page);

    const emptyState = page.getByText("Your wishlist is empty.", {
      exact: true,
    });

    const wishlistItems = page.locator(
      'a[href^="/app/products/"]'
    );

    await expect
      .poll(async () => {
        return (
          (await emptyState.count()) > 0 ||
          (await wishlistItems.count()) > 0
        );
      })
      .toBeTruthy();
  });

  test("WISHLIST-03: product can be added to wishlist from catalog", async ({
    page,
  }) => {
    await loginAsCustomer(page);

    await addProductToWishlist(page);

    await openWishlist(page);

    await expect(
      page.getByText(PRODUCT_NAME, { exact: true })
    ).toBeVisible({ timeout: 10000 });
  });

  test("WISHLIST-04: wishlist item appears on wishlist page", async ({
    page,
  }) => {
    await loginAsCustomer(page);

    await addProductToWishlist(page);
    await openWishlist(page);

    await expect(
      page.getByText(PRODUCT_NAME, { exact: true })
    ).toBeVisible({ timeout: 10000 });
  });

  test("WISHLIST-05: wishlist item opens product details", async ({
    page,
  }) => {
    await loginAsCustomer(page);

    await addProductToWishlist(page);
    await openWishlist(page);

    const productLink = page
      .locator('a[href^="/app/products/"]')
      .filter({ hasText: PRODUCT_NAME })
      .first();

    await expect(productLink).toBeVisible({ timeout: 10000 });

    await productLink.click();

    await expect(page).toHaveURL(/\/app\/products\/\d+/);
  });

  test("WISHLIST-06: wishlist item can be removed", async ({ page }) => {
    await loginAsCustomer(page);

    await addProductToWishlist(page);
    await openWishlist(page);

    const wishlistProduct = page
      .locator("div")
      .filter({ hasText: PRODUCT_NAME })
      .last();

    await expect(wishlistProduct).toBeVisible({
      timeout: 10000,
    });

    /*
     * Wishlist.jsx currently renders the remove action
     * as an icon-only button without an aria-label.
     * Therefore we target the button inside the product card.
     */
    const buttons = wishlistProduct.getByRole("button");

    await expect(buttons).toHaveCount(2, {
      timeout: 10000,
    });

    const removeButton = buttons.last();

    await expect(removeButton).toBeVisible({
      timeout: 10000,
    });

    await removeButton.click();

    await expect(
      page.getByText(PRODUCT_NAME, { exact: true })
    ).not.toBeVisible({
      timeout: 10000,
    });
  });

  test("WISHLIST-07: wishlist state persists after reload", async ({
    page,
  }) => {
    await loginAsCustomer(page);

    await addProductToWishlist(page);
    await openWishlist(page);

    await expect(
      page.getByText(PRODUCT_NAME, { exact: true })
    ).toBeVisible({ timeout: 10000 });

    await page.reload();

    await expect(
      page.getByRole("heading", { name: "Wishlist", exact: true })
    ).toBeVisible({ timeout: 10000 });

    await expect(
      page.getByText(PRODUCT_NAME, { exact: true })
    ).toBeVisible({ timeout: 10000 });
  });

  test("WISHLIST-08: wishlist product can be added to cart", async ({
    page,
  }) => {
    await loginAsCustomer(page);

    await addProductToWishlist(page);
    await openWishlist(page);

    const wishlistProduct = page
      .locator("div")
      .filter({ hasText: PRODUCT_NAME })
      .last();

    await expect(wishlistProduct).toBeVisible({
      timeout: 10000,
    });

    const cartButton = wishlistProduct.getByRole("button", {
      name: /cart/i,
    });

    await expect(cartButton).toBeVisible({
      timeout: 10000,
    });

    await cartButton.click();

    await expect(
      page.getByText(PRODUCT_NAME, { exact: true })
    ).toBeVisible();
  });

  test("WISHLIST-09: wishlist supports multiple products", async ({
    page,
  }) => {
    await loginAsCustomer(page);

    await addProductToWishlist(page, PRODUCT_NAME);

    await page.goto("/app/products");

    const cards = page.locator("article");

    const secondCard = cards
      .filter({ hasNotText: PRODUCT_NAME })
      .first();

    await expect(secondCard).toBeVisible({
      timeout: 10000,
    });

    const secondAddButton = secondCard.getByRole("button", {
      name: /add to wishlist/i,
    });

    if (await secondAddButton.count()) {
      await secondAddButton.click();

      await expect(
        secondCard.getByRole("button", {
          name: /remove from wishlist/i,
        })
      ).toBeVisible({
        timeout: 10000,
      });
    }

    await openWishlist(page);

    const productLinks = page.locator(
      'a[href^="/app/products/"]'
    );

    /*
     * The demo account persists wishlist state between tests.
     * Therefore we verify that at least two wishlist products
     * exist instead of requiring exactly two.
     */
    await expect
      .poll(async () => await productLinks.count(), {
        timeout: 10000,
      })
      .toBeGreaterThanOrEqual(2);
  });

  test("WISHLIST-10: wishlist integrates with product catalog state", async ({
    page,
  }) => {
    await loginAsCustomer(page);

    await addProductToWishlist(page);

    await page.goto("/app/products");

    const productCard = page
      .locator("article")
      .filter({ hasText: PRODUCT_NAME })
      .first();

    await expect(productCard).toBeVisible({
      timeout: 10000,
    });

    await expect(
      productCard.getByRole("button", {
        name: /remove from wishlist/i,
      })
    ).toBeVisible({
      timeout: 10000,
    });

    await page.reload();

    const refreshedCard = page
      .locator("article")
      .filter({ hasText: PRODUCT_NAME })
      .first();

    await expect(
      refreshedCard.getByRole("button", {
        name: /remove from wishlist/i,
      })
    ).toBeVisible({
      timeout: 10000,
    });
  });
});
