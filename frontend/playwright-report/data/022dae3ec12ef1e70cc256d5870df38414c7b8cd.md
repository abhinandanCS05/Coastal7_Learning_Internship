# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 03-wishlist.spec.ts >> Wishlist E2E >> WISHLIST-10: wishlist integrates with product catalog state
- Location: e2e\03-wishlist.spec.ts:296:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('article').filter({ hasText: 'Nova X Pro 5G' }).first()
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" locator('article').filter({ hasText: 'Nova X Pro 5G' }).first() with timeout 10000ms
  - waiting for locator('article').filter({ hasText: 'Nova X Pro 5G' }).first()

```

```yaml
- button "Notifications":
  - img
- button "Support":
  - img
  - text: Support
- banner:
  - link "shopflow":
    - /url: /app
  - img
  - textbox "Search products, categories and more..."
  - navigation:
    - link "Wishlist":
      - /url: /app/wishlist
      - img
    - link "My Orders":
      - /url: /app/orders
      - img
    - link "1":
      - /url: /app/cart
      - img
      - text: "1"
    - button "Toggle theme":
      - img
    - img
    - text: Demo Customer
    - button "Logout":
      - img
- main:
  - main:
    - paragraph: SHOP / CATALOG
    - heading "Discover products" [level=1]
    - paragraph: Showing 20 of 126 products
    - combobox:
      - 'option "Sort: Relevance" [selected]'
      - 'option "Price: Low to High"'
      - 'option "Price: High to Low"'
      - option "Customer Rating"
      - option "Best Discount"
      - option "Newest"
    - complementary:
      - img
      - text: Filters
      - button "Clear"
      - text: Search
      - textbox "Search"
      - text: Category
      - combobox "Category":
        - option "All categories" [selected]
        - option "Electronics"
        - option "Home & Kitchen"
        - option "accesories"
        - option "Personal Care"
        - option "Cycles"
        - option "Accessories"
        - option "Clothing"
        - option "Sports & Fitness"
        - option "Beauty & Personal Care"
        - option "Books & Stationery"
      - textbox "Min":
        - /placeholder: "Min "
      - textbox "Max":
        - /placeholder: "Max "
    - article:
      - link "PixelEdge 9 Only 0 left Limited Stock":
        - /url: /app/products/2
        - img "PixelEdge 9"
        - text: Only 0 left Limited Stock
      - text: Electronics � Phones
      - link "PixelEdge 9":
        - /url: /app/products/2
      - button "Remove from wishlist":
        - img
      - img
      - text: 4.1 (562) 999 1,198.8 17% off
      - paragraph: Save ₹199 today
      - button "Add to cart":
        - img
        - text: Add to cart
    - article:
      - link "GalaxyMax Ultra":
        - /url: /app/products/3
        - img "GalaxyMax Ultra"
      - text: Electronics � Phones
      - link "GalaxyMax Ultra":
        - /url: /app/products/3
      - button "Add to wishlist":
        - img
      - img
      - text: 4 (147) 19,999 23,998.8 17% off
      - paragraph: Save ₹3999 today
      - button "Add to cart":
        - img
        - text: Add to cart
    - article:
      - link "AeroPhone 12":
        - /url: /app/products/4
        - img "AeroPhone 12"
      - text: Electronics � Phones
      - link "AeroPhone 12":
        - /url: /app/products/4
      - button "Add to wishlist":
        - img
      - img
      - text: 4.7 (104) 19,999 22,998.85 13% off
      - paragraph: Save ₹2999 today
      - button "Add to cart":
        - img
        - text: Add to cart
    - article:
      - link "ProBook Air 14":
        - /url: /app/products/5
        - img "ProBook Air 14"
      - text: Electronics � Laptops
      - link "ProBook Air 14":
        - /url: /app/products/5
      - button "Add to wishlist":
        - img
      - img
      - text: 4.6 (160) 19,999 24,998.75 20% off
      - paragraph: Save ₹4999 today
      - button "Add to cart":
        - img
        - text: Add to cart
    - article:
      - link "UltraNote 15":
        - /url: /app/products/6
        - img "UltraNote 15"
      - text: Electronics � Laptops
      - link "UltraNote 15":
        - /url: /app/products/6
      - button "Add to wishlist":
        - img
      - img
      - text: 4.7 (516) 12,999 16,248.75 20% off
      - paragraph: Save ₹3249 today
      - button "Add to cart":
        - img
        - text: Add to cart
    - article:
      - link "CreatorBook 16 Bestseller":
        - /url: /app/products/7
        - img "CreatorBook 16"
        - text: Bestseller
      - text: Electronics � Laptops
      - link "CreatorBook 16":
        - /url: /app/products/7
      - button "Remove from wishlist":
        - img
      - img
      - text: 4.7 (671) 29,999 38,998.7 23% off
      - paragraph: Save ₹8999 today
      - button "Add to cart":
        - img
        - text: Add to cart
    - article:
      - link "WorkMate 13":
        - /url: /app/products/8
        - img "WorkMate 13"
      - text: Electronics � Laptops
      - link "WorkMate 13":
        - /url: /app/products/8
      - button "Add to wishlist":
        - img
      - img
      - text: 4.7 (835) 1,999 2,298.85 13% off
      - paragraph: Save ₹299 today
      - button "Add to cart":
        - img
        - text: Add to cart
    - article:
      - link "Vision 43 4K":
        - /url: /app/products/9
        - img "Vision 43 4K"
      - text: Electronics � Televisions
      - link "Vision 43 4K":
        - /url: /app/products/9
      - button "Add to wishlist":
        - img
      - img
      - text: 4.4 (784) 6,999 8,748.75 20% off
      - paragraph: Save ₹1749 today
      - button "Add to cart":
        - img
        - text: Add to cart
    - article:
      - link "Cinema 55 QLED":
        - /url: /app/products/10
        - img "Cinema 55 QLED"
      - text: Electronics � Televisions
      - link "Cinema 55 QLED":
        - /url: /app/products/10
      - button "Add to wishlist":
        - img
      - img
      - text: 4.4 (318) 999 1,298.7 23% off
      - paragraph: Save ₹299 today
      - button "Add to cart":
        - img
        - text: Add to cart
    - article:
      - link "ViewMax 65":
        - /url: /app/products/11
        - img "ViewMax 65"
      - text: Electronics � Televisions
      - link "ViewMax 65":
        - /url: /app/products/11
      - button "Add to wishlist":
        - img
      - img
      - text: 4.3 (398) 1,299 1,558.8 17% off
      - paragraph: Save ₹259 today
      - button "Add to cart":
        - img
        - text: Add to cart
    - article:
      - link "SmartTV 50":
        - /url: /app/products/12
        - img "SmartTV 50"
      - text: Electronics � Televisions
      - link "SmartTV 50":
        - /url: /app/products/12
      - button "Add to wishlist":
        - img
      - img
      - text: 4.3 (151) 2,999 3,748.75 20% off
      - paragraph: Save ₹749 today
      - button "Add to cart":
        - img
        - text: Add to cart
    - article:
      - link "Smart Speaker":
        - /url: /app/products/13
        - img "Smart Speaker"
      - text: Electronics � Home Gadgets
      - link "Smart Speaker":
        - /url: /app/products/13
      - button "Add to wishlist":
        - img
      - img
      - text: 4.2 (259) 4,999 6,498.7 23% off
      - paragraph: Save ₹1499 today
      - button "Add to cart":
        - img
        - text: Add to cart
    - article:
      - link "Robot Vacuum Bestseller":
        - /url: /app/products/14
        - img "Robot Vacuum"
        - text: Bestseller
      - text: Electronics � Home Gadgets
      - link "Robot Vacuum":
        - /url: /app/products/14
      - button "Add to wishlist":
        - img
      - img
      - text: 4.1 (458) 29,999 35,998.8 17% off
      - paragraph: Save ₹5999 today
      - button "Add to cart":
        - img
        - text: Add to cart
    - article:
      - link "Air Purifier":
        - /url: /app/products/15
        - img "Air Purifier"
      - text: Electronics � Home Gadgets
      - link "Air Purifier":
        - /url: /app/products/15
      - button "Add to wishlist":
        - img
      - img
      - text: 4 (452) 6,999 9,098.7 23% off
      - paragraph: Save ₹2099 today
      - button "Add to cart":
        - img
        - text: Add to cart
    - article:
      - link "Smart Display Only 9 left Limited Stock":
        - /url: /app/products/16
        - img "Smart Display"
        - text: Only 9 left Limited Stock
      - text: Electronics � Home Gadgets
      - link "Smart Display":
        - /url: /app/products/16
      - button "Add to wishlist":
        - img
      - img
      - text: 4.1 (843) 29,999 34,498.85 13% off
      - paragraph: Save ₹4499 today
      - button "Add to cart":
        - img
        - text: Add to cart
    - article:
      - link "Wireless Earbuds":
        - /url: /app/products/17
        - img "Wireless Earbuds"
      - text: Electronics � Accessories
      - link "Wireless Earbuds":
        - /url: /app/products/17
      - button "Add to wishlist":
        - img
      - img
      - text: 4.1 (441) 8,999 11,698.7 23% off
      - paragraph: Save ₹2699 today
      - button "Add to cart":
        - img
        - text: Add to cart
    - article:
      - link "Mechanical Keyboard":
        - /url: /app/products/18
        - img "Mechanical Keyboard"
      - text: Electronics � Accessories
      - link "Mechanical Keyboard":
        - /url: /app/products/18
      - button "Add to wishlist":
        - img
      - img
      - text: 4.2 (892) 8,999 11,248.75 20% off
      - paragraph: Save ₹2249 today
      - button "Add to cart":
        - img
        - text: Add to cart
    - article:
      - link "USB-C Hub":
        - /url: /app/products/19
        - img "USB-C Hub"
      - text: Electronics � Accessories
      - link "USB-C Hub":
        - /url: /app/products/19
      - button "Add to wishlist":
        - img
      - img
      - text: 4.6 (158) 6,999 8,748.75 20% off
      - paragraph: Save ₹1749 today
      - button "Add to cart":
        - img
        - text: Add to cart
    - article:
      - link "Power Bank":
        - /url: /app/products/20
        - img "Power Bank"
      - text: Electronics � Accessories
      - link "Power Bank":
        - /url: /app/products/20
      - button "Add to wishlist":
        - img
      - img
      - text: 4.2 (650) 29,999 35,998.8 17% off
      - paragraph: Save ₹5999 today
      - button "Add to cart":
        - img
        - text: Add to cart
    - article:
      - link "Classic Oxford Shirt Bestseller":
        - /url: /app/products/21
        - img "Classic Oxford Shirt"
        - text: Bestseller
      - text: Clothing � Men
      - link "Classic Oxford Shirt":
        - /url: /app/products/21
      - button "Add to wishlist":
        - img
      - img
      - text: 4.5 (601) 499 573.85 13% off
      - paragraph: Save ₹74 today
      - button "Add to cart":
        - img
        - text: Add to cart
- contentinfo: © 2026 ShopFlow · Smart shopping, simple checkout.
```

# Test source

```ts
  1   | import { test, expect, Page } from "@playwright/test";
  2   | 
  3   | const CUSTOMER_EMAIL = "demo@shopflow.com";
  4   | const CUSTOMER_PASSWORD = "Demo@123";
  5   | 
  6   | const PRODUCT_NAME = "Nova X Pro 5G";
  7   | 
  8   | async function loginAsCustomer(page: Page) {
  9   |   await page.goto("/login");
  10  | 
  11  |   await page.getByLabel("Email").fill(CUSTOMER_EMAIL);
  12  |   await page.getByLabel("Password").fill(CUSTOMER_PASSWORD);
  13  | 
  14  |   const customerRole = page.getByText("Customer", { exact: true });
  15  | 
  16  |   if (await customerRole.count()) {
  17  |     await customerRole.click();
  18  |   }
  19  | 
  20  |   await page.getByRole("button", { name: /sign in/i }).click();
  21  | 
  22  |   await expect(page).toHaveURL(/\/app/);
  23  | }
  24  | 
  25  | async function openWishlist(page: Page) {
  26  |   await page.goto("/app/wishlist");
  27  | 
  28  |   await expect(
  29  |     page.getByRole("heading", { name: "Wishlist", exact: true })
  30  |   ).toBeVisible({ timeout: 10000 });
  31  | }
  32  | 
  33  | async function addProductToWishlist(
  34  |   page: Page,
  35  |   productName = PRODUCT_NAME
  36  | ) {
  37  |   await page.goto("/app/products");
  38  | 
  39  |   const productCard = page
  40  |     .locator("article")
  41  |     .filter({ hasText: productName })
  42  |     .first();
  43  | 
> 44  |   await expect(productCard).toBeVisible({ timeout: 10000 });
      |                             ^ Error: expect(locator).toBeVisible() failed
  45  | 
  46  |   const removeButton = productCard.getByRole("button", {
  47  |     name: /remove from wishlist/i,
  48  |   });
  49  | 
  50  |   if (await removeButton.count()) {
  51  |     return;
  52  |   }
  53  | 
  54  |   const addButton = productCard.getByRole("button", {
  55  |     name: /add to wishlist/i,
  56  |   });
  57  | 
  58  |   await expect(addButton).toBeVisible({ timeout: 10000 });
  59  |   await addButton.click();
  60  | 
  61  |   await expect(
  62  |     productCard.getByRole("button", {
  63  |       name: /remove from wishlist/i,
  64  |     })
  65  |   ).toBeVisible({ timeout: 10000 });
  66  | }
  67  | 
  68  | test.describe("Wishlist E2E", () => {
  69  |   test("WISHLIST-01: wishlist page loads", async ({ page }) => {
  70  |     await loginAsCustomer(page);
  71  |     await openWishlist(page);
  72  | 
  73  |     await expect(
  74  |       page.getByRole("heading", { name: "Wishlist", exact: true })
  75  |     ).toBeVisible();
  76  |   });
  77  | 
  78  |   test("WISHLIST-02: wishlist displays current state", async ({ page }) => {
  79  |     await loginAsCustomer(page);
  80  |     await openWishlist(page);
  81  | 
  82  |     const emptyState = page.getByText("Your wishlist is empty.", {
  83  |       exact: true,
  84  |     });
  85  | 
  86  |     const wishlistItems = page.locator(
  87  |       'a[href^="/app/products/"]'
  88  |     );
  89  | 
  90  |     await expect
  91  |       .poll(async () => {
  92  |         return (
  93  |           (await emptyState.count()) > 0 ||
  94  |           (await wishlistItems.count()) > 0
  95  |         );
  96  |       })
  97  |       .toBeTruthy();
  98  |   });
  99  | 
  100 |   test("WISHLIST-03: product can be added to wishlist from catalog", async ({
  101 |     page,
  102 |   }) => {
  103 |     await loginAsCustomer(page);
  104 | 
  105 |     await addProductToWishlist(page);
  106 | 
  107 |     await openWishlist(page);
  108 | 
  109 |     await expect(
  110 |       page.getByText(PRODUCT_NAME, { exact: true })
  111 |     ).toBeVisible({ timeout: 10000 });
  112 |   });
  113 | 
  114 |   test("WISHLIST-04: wishlist item appears on wishlist page", async ({
  115 |     page,
  116 |   }) => {
  117 |     await loginAsCustomer(page);
  118 | 
  119 |     await addProductToWishlist(page);
  120 |     await openWishlist(page);
  121 | 
  122 |     await expect(
  123 |       page.getByText(PRODUCT_NAME, { exact: true })
  124 |     ).toBeVisible({ timeout: 10000 });
  125 |   });
  126 | 
  127 |   test("WISHLIST-05: wishlist item opens product details", async ({
  128 |     page,
  129 |   }) => {
  130 |     await loginAsCustomer(page);
  131 | 
  132 |     await addProductToWishlist(page);
  133 |     await openWishlist(page);
  134 | 
  135 |     const productLink = page
  136 |       .locator('a[href^="/app/products/"]')
  137 |       .filter({ hasText: PRODUCT_NAME })
  138 |       .first();
  139 | 
  140 |     await expect(productLink).toBeVisible({ timeout: 10000 });
  141 | 
  142 |     await productLink.click();
  143 | 
  144 |     await expect(page).toHaveURL(/\/app\/products\/\d+/);
```