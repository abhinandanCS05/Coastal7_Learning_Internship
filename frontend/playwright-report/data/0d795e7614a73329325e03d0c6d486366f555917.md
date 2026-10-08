# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 10-theme.spec.ts >> ShopFlow Theme E2E >> THEME-02 - Theme toggle changes UI state
- Location: e2e\10-theme.spec.ts:25:3

# Error details

```
Error: expect(received).not.toBeNull()

Received: null
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - button "Notifications" [ref=e4]
  - button "Support" [ref=e8]
  - generic [ref=e11]:
    - banner [ref=e12]:
      - generic [ref=e13]:
        - link "shopflow" [ref=e14] [cursor=pointer]:
          - /url: /app
        - textbox "Search products, categories and more..." [ref=e20]
        - navigation [ref=e21]:
          - link "Wishlist" [ref=e22] [cursor=pointer]:
            - /url: /app/wishlist
          - link "My Orders" [ref=e25] [cursor=pointer]:
            - /url: /app/orders
          - link "Cart" [ref=e30] [cursor=pointer]:
            - /url: /app/cart
          - button "Toggle theme" [active] [ref=e35]
          - generic [ref=e42]:
            - generic [ref=e46]: Demo Customer
            - button "Logout" [ref=e47]
    - main [ref=e51]:
      - main [ref=e52]:
        - generic [ref=e54]:
          - generic [ref=e55]:
            - generic [ref=e56]: ShopFlow 2026
            - heading "Shopping that feels beautifully simple." [level=1] [ref=e59]:
              - text: Shopping that feels
              - generic [ref=e60]: beautifully simple.
            - paragraph [ref=e61]: Discover 120+ products across electronics, fashion, home, beauty, fitness and more ? all in one intelligent shopping experience.
            - generic [ref=e62]:
              - link "Shop all products" [ref=e63] [cursor=pointer]:
                - /url: /app/products
              - link "Explore electronics" [ref=e66] [cursor=pointer]:
                - /url: /app/products?category=Electronics
            - generic [ref=e67]:
              - generic [ref=e68]: Secure checkout
              - generic [ref=e72]: Fast delivery
              - generic [ref=e78]: Smart offers
          - generic [ref=e81]:
            - img "Featured product" [ref=e83]
            - img "Smart technology" [ref=e85]
            - img "Featured fashion" [ref=e87]
            - generic [ref=e88]:
              - generic [ref=e89]: 120+
              - generic [ref=e90]: products to explore
        - generic [ref=e91]:
          - generic [ref=e92]:
            - paragraph [ref=e93]: Welcome offer
            - paragraph [ref=e94]: 10% OFF
            - paragraph [ref=e95]: On orders above 999
          - generic [ref=e96]:
            - paragraph [ref=e97]: Premium saving
            - paragraph [ref=e98]: 500 OFF
            - paragraph [ref=e99]: On orders above 7,999
          - generic [ref=e100]:
            - paragraph [ref=e101]: Delivery offer
            - paragraph [ref=e102]: FREE SHIPPING
            - paragraph [ref=e103]: On orders above 499
        - generic [ref=e104]:
          - generic [ref=e105]:
            - generic [ref=e106]:
              - paragraph [ref=e107]: Explore collections
              - heading "Shop by category" [level=2] [ref=e108]
            - link "View all" [ref=e109] [cursor=pointer]:
              - /url: /app/products
          - generic [ref=e112]:
            - link [ref=e113] [cursor=pointer]:
              - /url: /app/products?category=Electronics
              - img "Electronics" [ref=e114]
              - generic [ref=e118]:
                - heading "Electronics" [level=3] [ref=e119]
                - paragraph [ref=e120]: Phones, laptops & smart tech
            - link [ref=e124] [cursor=pointer]:
              - /url: /app/products?category=Clothing
              - img "Clothing" [ref=e125]
              - generic [ref=e129]:
                - heading "Clothing" [level=3] [ref=e130]
                - paragraph [ref=e131]: Modern styles for everyone
            - link [ref=e135] [cursor=pointer]:
              - /url: /app/products?category=Home%20%26%20Kitchen
              - img "Home & Kitchen" [ref=e136]
              - generic [ref=e140]:
                - heading "Home & Kitchen" [level=3] [ref=e141]
                - paragraph [ref=e142]: Upgrade your everyday space
            - link [ref=e146] [cursor=pointer]:
              - /url: /app/products?category=Beauty%20%26%20Personal%20Care
              - img "Beauty & Personal Care" [ref=e147]
              - generic [ref=e151]:
                - heading "Beauty & Personal Care" [level=3] [ref=e152]
                - paragraph [ref=e153]: Care, confidence & essentials
            - link [ref=e157] [cursor=pointer]:
              - /url: /app/products?category=Sports%20%26%20Fitness
              - img "Sports & Fitness" [ref=e158]
              - generic [ref=e162]:
                - heading "Sports & Fitness" [level=3] [ref=e163]
                - paragraph [ref=e164]: Move better. Live stronger.
            - link [ref=e168] [cursor=pointer]:
              - /url: /app/products?category=Books%20%26%20Stationery
              - img "Books & Stationery" [ref=e169]
              - generic [ref=e173]:
                - heading "Books & Stationery" [level=3] [ref=e174]
                - paragraph [ref=e175]: Ideas worth discovering
        - generic [ref=e179]:
          - generic [ref=e180]:
            - heading "Fast delivery" [level=3] [ref=e187]
            - paragraph [ref=e188]: Track every order
          - generic [ref=e189]:
            - heading "Secure checkout" [level=3] [ref=e194]
            - paragraph [ref=e195]: Protected account flow
          - generic [ref=e196]:
            - heading "Smart offers" [level=3] [ref=e200]
            - paragraph [ref=e201]: Save on eligible orders
          - generic [ref=e202]:
            - heading "Customer first" [level=3] [ref=e206]
            - paragraph [ref=e207]: Simple support experience
    - contentinfo [ref=e208]: © 2026 ShopFlow · Smart shopping, simple checkout.
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | async function loginAsCustomer(page: any) {
  4  |   await page.goto("/login");
  5  |   await page.getByLabel("Email").fill("demo@shopflow.com");
  6  |   await page.getByLabel("Password").fill("Demo@123");
  7  |   await page.getByText("Customer", { exact: true }).click();
  8  |   await page.getByRole("button", { name: /sign in/i }).click();
  9  |   await expect(page).toHaveURL(/\/app$/, { timeout: 10000 });
  10 | }
  11 | 
  12 | test.describe("ShopFlow Theme E2E", () => {
  13 |   test("THEME-01 - Theme control is available in authenticated UI", async ({
  14 |     page,
  15 |   }) => {
  16 |     await loginAsCustomer(page);
  17 | 
  18 |     const themeControls = page.locator(
  19 |       'button[aria-label*="theme" i], button[title*="theme" i], button'
  20 |     );
  21 | 
  22 |     expect(await themeControls.count()).toBeGreaterThan(0);
  23 |   });
  24 | 
  25 |   test("THEME-02 - Theme toggle changes UI state", async ({ page }) => {
  26 |     await loginAsCustomer(page);
  27 | 
  28 |     const themeButton = page.locator(
  29 |       'button[aria-label*="theme" i], button[title*="theme" i]'
  30 |     );
  31 | 
  32 |     if (await themeButton.count()) {
  33 |       const before = await page.locator("html").getAttribute("class");
  34 |       await themeButton.first().click();
  35 |       const after = await page.locator("html").getAttribute("class");
  36 | 
  37 |       expect(after).toBeDefined();
> 38 |       expect(before).not.toBeNull();
     |                          ^ Error: expect(received).not.toBeNull()
  39 |     } else {
  40 |       expect(await page.locator("body").count()).toBe(1);
  41 |     }
  42 |   });
  43 | 
  44 |   test("THEME-03 - Theme change keeps application functional", async ({
  45 |     page,
  46 |   }) => {
  47 |     await loginAsCustomer(page);
  48 | 
  49 |     const themeButton = page.locator(
  50 |       'button[aria-label*="theme" i], button[title*="theme" i]'
  51 |     );
  52 | 
  53 |     if (await themeButton.count()) {
  54 |       await themeButton.first().click();
  55 |     }
  56 | 
  57 |     await page.goto("/app/products");
  58 | 
  59 |     await expect(
  60 |       page.locator("article").first()
  61 |     ).toBeVisible({ timeout: 10000 });
  62 |   });
  63 | 
  64 |   test("THEME-04 - Theme state survives reload", async ({ page }) => {
  65 |     await loginAsCustomer(page);
  66 | 
  67 |     const themeButton = page.locator(
  68 |       'button[aria-label*="theme" i], button[title*="theme" i]'
  69 |     );
  70 | 
  71 |     if (await themeButton.count()) {
  72 |       await themeButton.first().click();
  73 |     }
  74 | 
  75 |     await page.reload();
  76 | 
  77 |     await expect(page).toHaveURL(/\/app$/);
  78 |   });
  79 | 
  80 |   test("THEME-05 - Theme works on orders page", async ({ page }) => {
  81 |     await loginAsCustomer(page);
  82 | 
  83 |     await page.goto("/app/orders");
  84 | 
  85 |     await expect(
  86 |       page.getByRole("heading", { name: /my orders/i })
  87 |     ).toBeVisible({ timeout: 10000 });
  88 |   });
  89 | });
  90 | 
```