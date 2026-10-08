# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 04-cart.spec.ts >> Cart E2E >> CART-06: product quantity can be decreased
- Location: e2e\04-cart.spec.ts:163:3

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
  25  | async function openCart(page: Page) {
  26  |   await page.goto("/app/cart");
  27  | 
  28  |   await expect(
  29  |     page.getByRole("heading", { name: "Shopping Cart", exact: true })
  30  |   ).toBeVisible({ timeout: 10000 });
  31  | }
  32  | 
  33  | async function addProductToCart(
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
  46  |   const addButton = productCard.getByRole("button", {
  47  |     name: /add to cart/i,
  48  |   });
  49  | 
  50  |   if (await addButton.count()) {
  51  |     await addButton.click();
  52  |   }
  53  | 
  54  |   await page.goto("/app/cart");
  55  | 
  56  |   await expect(
  57  |     page.getByText(productName, { exact: true })
  58  |   ).toBeVisible({ timeout: 10000 });
  59  | }
  60  | 
  61  | function getCartItem(page: Page, productName = PRODUCT_NAME) {
  62  |   return page
  63  |     .locator("section")
  64  |     .locator("div")
  65  |     .filter({ hasText: productName })
  66  |     .last();
  67  | }
  68  | 
  69  | test.describe("Cart E2E", () => {
  70  |   test("CART-01: cart page loads", async ({ page }) => {
  71  |     await loginAsCustomer(page);
  72  |     await openCart(page);
  73  | 
  74  |     await expect(
  75  |       page.getByRole("heading", { name: "Shopping Cart", exact: true })
  76  |     ).toBeVisible();
  77  |   });
  78  | 
  79  |   test("CART-02: cart handles empty or existing state", async ({ page }) => {
  80  |     await loginAsCustomer(page);
  81  |     await page.goto("/app/cart");
  82  | 
  83  |     const emptyState = page.getByText("Your cart is empty", {
  84  |       exact: true,
  85  |     });
  86  | 
  87  |     const shoppingCartHeading = page.getByRole("heading", {
  88  |       name: "Shopping Cart",
  89  |       exact: true,
  90  |     });
  91  | 
  92  |     await expect
  93  |       .poll(async () => {
  94  |         return (
  95  |           (await emptyState.count()) > 0 ||
  96  |           (await shoppingCartHeading.count()) > 0
  97  |         );
  98  |       })
  99  |       .toBeTruthy();
  100 |   });
  101 | 
  102 |   test("CART-03: product can be added to cart from catalog", async ({
  103 |     page,
  104 |   }) => {
  105 |     await loginAsCustomer(page);
  106 | 
  107 |     await addProductToCart(page);
  108 | 
  109 |     await expect(
  110 |       page.getByText(PRODUCT_NAME, { exact: true })
  111 |     ).toBeVisible();
  112 |   });
  113 | 
  114 |   test("CART-04: added product appears in cart", async ({ page }) => {
  115 |     await loginAsCustomer(page);
  116 | 
  117 |     await addProductToCart(page);
  118 | 
  119 |     await openCart(page);
  120 | 
  121 |     const productLink = page
  122 |       .locator('a[href^="/app/products/"]')
  123 |       .filter({ hasText: PRODUCT_NAME })
  124 |       .first();
  125 | 
  126 |     await expect(productLink).toBeVisible({
  127 |       timeout: 10000,
  128 |     });
  129 |   });
  130 | 
  131 |   test("CART-05: product quantity can be increased", async ({ page }) => {
  132 |     await loginAsCustomer(page);
  133 | 
  134 |     await addProductToCart(page);
  135 |     await openCart(page);
  136 | 
  137 |     const productItem = getCartItem(page);
  138 | 
  139 |     await expect(productItem).toBeVisible({
  140 |       timeout: 10000,
  141 |     });
  142 | 
  143 |     const buttons = productItem.getByRole("button");
  144 | 
```