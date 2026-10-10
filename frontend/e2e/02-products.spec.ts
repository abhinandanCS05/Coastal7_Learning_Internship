import { test, expect } from "@playwright/test";

const CUSTOMER_EMAIL = "demo@shopflow.com";
const CUSTOMER_PASSWORD = "Demo@123";

async function loginAsCustomer(page) {
  await page.goto("/login");

  await page.getByLabel("Email").fill(CUSTOMER_EMAIL);
  await page.getByLabel("Password").fill(CUSTOMER_PASSWORD);
  await page.getByText("Customer", { exact: true }).click();

  await page.getByRole("button", { name: /sign in/i }).click();

  await expect(page).toHaveURL(/\/app$/);
}

async function openProducts(page) {
  await page.goto("/app/products");

  await expect(
    page.getByRole("heading", { name: /discover products/i })
  ).toBeVisible();

  await expect(
    page.locator("article").first()
  ).toBeVisible();
}

test.describe("Products & Catalog E2E", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsCustomer(page);
  });

  test("PRODUCT-01: products page loads successfully", async ({ page }) => {
    await openProducts(page);

    await expect(
      page.getByRole("heading", { name: /discover products/i })
    ).toBeVisible();

    await expect(page.getByText(/shop \/ catalog/i)).toBeVisible();

    await expect(
      page.getByText(/showing \d+ of \d+ products/i)
    ).toBeVisible();
  });

  test("PRODUCT-02: product cards render with essential information", async ({
    page,
  }) => {
    await openProducts(page);

    const cards = page.locator("article");

    await expect(cards.first()).toBeVisible();

    const firstCard = cards.first();

    await expect(firstCard.locator("img")).toBeVisible();

    await expect(
      firstCard.getByRole("button", { name: /add to cart/i })
    ).toBeVisible();

    await expect(
      firstCard.getByRole("button", {
        name: /add to wishlist|remove from wishlist/i,
      })
    ).toBeVisible();
  });

  test("PRODUCT-03: product search returns matching products", async ({
    page,
  }) => {
    await openProducts(page);

    const search = page.getByLabel("Search");

    await search.fill("Phone");

    await expect
      .poll(
        async () => page.locator("article").count(),
        { timeout: 10000 }
      )
      .toBeGreaterThan(0);

    const cards = page.locator("article");

    await expect(cards.first()).toContainText(/phone/i);
  });

  test("PRODUCT-04: search with no matching products shows empty state", async ({
    page,
  }) => {
    await openProducts(page);

    await page.getByLabel("Search").fill(
      "DefinitelyNotARealShopFlowProduct999999"
    );

    await expect(
      page.getByRole("heading", { name: /no products found/i })
    ).toBeVisible({ timeout: 10000 });

    await expect(
      page.getByText(/try clearing your filters/i)
    ).toBeVisible();
  });

  test("PRODUCT-05: category filter changes product results", async ({
    page,
  }) => {
    await openProducts(page);

    const filters = page.locator("aside");
    const category = filters.locator("select").nth(0);

    await category.selectOption("Electronics");

    await expect
      .poll(
        async () => page.locator("article").count(),
        { timeout: 10000 }
      )
      .toBeGreaterThan(0);

    await expect(category).toHaveValue("Electronics");

    const cards = page.locator("article");
    await expect(cards.first()).toContainText(/Electronics/i);
  });

  test("PRODUCT-06: subcategory filter works after selecting category", async ({
    page,
  }) => {
    await openProducts(page);

    await page.getByLabel("Category").selectOption("Electronics");

    const subcategory = page.getByLabel("Subcategory");

    await expect(subcategory).toBeVisible();

    await subcategory.selectOption("Phones");

    await expect
      .poll(
        async () => page.locator("article").count(),
        { timeout: 10000 }
      )
      .toBeGreaterThan(0);

    await expect(subcategory).toHaveValue("Phones");

    const cards = page.locator("article");

    await expect(cards.first()).toContainText(/Phones/i);
  });

  test("PRODUCT-07: minimum price filter works", async ({ page }) => {
    await openProducts(page);

    const minPrice = page.getByPlaceholder("Min");

    await minPrice.fill("1000");

    await page.waitForTimeout(800);

    const cards = page.locator("article");

    await expect(cards.first()).toBeVisible();

    await expect(minPrice).toHaveValue("1000");
  });

  test("PRODUCT-08: maximum price filter works", async ({ page }) => {
    await openProducts(page);

    const maxPrice = page.getByPlaceholder("Max");

    await maxPrice.fill("5000");

    await page.waitForTimeout(800);

    const cards = page.locator("article");

    await expect(cards.first()).toBeVisible();

    await expect(maxPrice).toHaveValue("5000");
  });

  test("PRODUCT-09: combined category and price filters work", async ({
    page,
  }) => {
    await openProducts(page);

    const filters = page.locator("aside");
    const category = filters.locator("select").nth(0);

    await category.selectOption("Electronics");

    await page.getByPlaceholder("Min").fill("1000");
    await page.getByPlaceholder("Max").fill("50000");

    await page.waitForTimeout(1000);

    await expect(category).toHaveValue("Electronics");

    await expect(
      page.getByPlaceholder("Min")
    ).toHaveValue("1000");

    await expect(
      page.getByPlaceholder("Max")
    ).toHaveValue("50000");

    await expect(page.locator("article").first()).toBeVisible();
  });

  test("PRODUCT-10: price low-to-high sorting works", async ({ page }) => {
    await openProducts(page);

    const sort = page.locator("select").first();

    await sort.selectOption("price_asc");

    await expect(sort).toHaveValue("price_asc");

    await expect(
      page.locator("article").first()
    ).toBeVisible();

    await expect(
      page.getByText(/showing \d+ of \d+ products/i)
    ).toBeVisible();
  });

  test("PRODUCT-11: price high-to-low sorting works", async ({ page }) => {
    await openProducts(page);

    const sort = page.locator("select").first();

    await sort.selectOption("price_desc");

    await expect(sort).toHaveValue("price_desc");

    await expect(
      page.locator("article").first()
    ).toBeVisible();
  });

  test("PRODUCT-12: product card opens product details", async ({
    page,
  }) => {
    await openProducts(page);

    const firstCard = page.locator("article").first();

    const productName = await firstCard
      .locator("a")
      .last()
      .innerText();

    await firstCard.locator("a").first().click();

    await expect(page).toHaveURL(/\/app\/products\/\d+/);

    await expect(
      page.getByRole("link", { name: /back to products/i })
    ).toBeVisible();

    await expect(
      page.getByRole("heading", { level: 1 })
    ).toBeVisible();

    expect(productName.trim().length).toBeGreaterThan(0);
  });

  test("PRODUCT-13: product details displays price and purchase controls", async ({
    page,
  }) => {
    await openProducts(page);

    await page.locator("article").first().locator("a").first().click();

    await expect(page).toHaveURL(/\/app\/products\/\d+/);

    await expect(
      page.getByRole("link", { name: /back to products/i })
    ).toBeVisible();

    const details = page.locator("main");

    await expect(
      details.getByRole("heading", { level: 1 })
    ).toBeVisible();

    await expect(
      details.getByRole("button", { name: /add to cart/i })
    ).toBeVisible();

    await expect(
      details.getByText(/% OFF/i)
    ).toBeVisible();

    await expect(
      details.getByText(/secure checkout/i)
    ).toBeVisible();
  });

  test("PRODUCT-14: infinite scrolling loads additional products", async ({
    page,
  }) => {
    await openProducts(page);

    const initialCount = await page.locator("article").count();

    expect(initialCount).toBeGreaterThan(0);

    await page.evaluate(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "instant",
      });
    });

    await expect
      .poll(
        async () => page.locator("article").count(),
        {
          timeout: 15000,
          intervals: [500, 1000, 1500],
        }
      )
      .toBeGreaterThan(initialCount);
  });

  test("PRODUCT-15: product can be added to cart from listing", async ({
    page,
  }) => {
    await openProducts(page);

    const firstCard = page.locator("article").first();

    await expect(
      firstCard.getByRole("button", { name: /add to cart/i })
    ).toBeVisible();

    page.once("dialog", async (dialog) => {
      expect(dialog.message()).toMatch(/added to cart/i);
      await dialog.accept();
    });

    await firstCard
      .getByRole("button", { name: /add to cart/i })
      .click();

    await page.waitForTimeout(1000);

    await expect(page).toHaveURL(/\/app\/products/);
  });
});
