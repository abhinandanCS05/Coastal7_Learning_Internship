# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 05-checkout.spec.ts >> Checkout E2E >> CHECKOUT-12: bill details render
- Location: e2e\05-checkout.spec.ts:288:3

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /\/app/
Received string:  "http://127.0.0.1:5173/login"

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    10 × locator resolved to <html>…</html>
       - unexpected value "http://127.0.0.1:5173/login"
  - Target page, context or browser has been closed

```

```yaml
- button "Notifications":
  - img
- button "Support":
  - img
  - text: Support
- text: shopflow
- img
- heading "Everything you need. One smart shopping flow." [level=1]
- paragraph: A complete e-commerce experience with discovery, offers, wishlist, secure checkout and live order operations.
- paragraph: Day 10–17 Engineering Project
- heading "Welcome back" [level=2]
- paragraph: Sign in to continue to ShopFlow.
- text: Unable to login Email
- textbox "Email": demo@shopflow.com
- text: Password
- textbox "Password": Demo@123
- button:
  - img
- button "Customer"
- button "Admin":
  - img
  - text: Admin
- button "Sign In"
- paragraph:
  - text: New to ShopFlow?
  - link "Create account":
    - /url: /register
- paragraph: "Demo customer: demo@shopflow.com / Demo@123 Demo admin: admin@shopflow.com / Admin@123"
```

# Test source

```ts
  1   | import { test, expect, Page } from "@playwright/test";
  2   | 
  3   | const CUSTOMER_EMAIL = "demo@shopflow.com";
  4   | const CUSTOMER_PASSWORD = "Demo@123";
  5   | const PRODUCT_NAME = "Nova X Pro 5G";
  6   | 
  7   | async function loginAsCustomer(page: Page) {
  8   |   await page.goto("/login");
  9   | 
  10  |   await page.getByLabel("Email").fill(CUSTOMER_EMAIL);
  11  |   await page.getByLabel("Password").fill(CUSTOMER_PASSWORD);
  12  | 
  13  |   const customerRole = page.getByText("Customer", { exact: true });
  14  | 
  15  |   if (await customerRole.count()) {
  16  |     await customerRole.click();
  17  |   }
  18  | 
  19  |   await page.getByRole("button", { name: /sign in/i }).click();
  20  | 
> 21  |   await expect(page).toHaveURL(/\/app/);
      |                      ^ Error: expect(page).toHaveURL(expected) failed
  22  | }
  23  | 
  24  | async function ensureCartProduct(page: Page) {
  25  |   await page.goto("/app/products", {
  26  |     waitUntil: "domcontentloaded",
  27  |   });
  28  | 
  29  |   const productCard = page
  30  |     .locator("article")
  31  |     .filter({ hasText: PRODUCT_NAME })
  32  |     .first();
  33  | 
  34  |   await expect(productCard).toBeVisible({
  35  |     timeout: 10000,
  36  |   });
  37  | 
  38  |   const addButton = productCard.getByRole("button", {
  39  |     name: /add to cart/i,
  40  |   });
  41  | 
  42  |   if (await addButton.count()) {
  43  |     await addButton.click();
  44  |   }
  45  | 
  46  |   await page.goto("/app/cart", {
  47  |     waitUntil: "domcontentloaded",
  48  |   });
  49  | 
  50  |   await expect(
  51  |     page.getByText(PRODUCT_NAME, { exact: true })
  52  |   ).toBeVisible({
  53  |     timeout: 10000,
  54  |   });
  55  | }
  56  | 
  57  | async function openCheckout(page: Page) {
  58  |   await page.goto("/app/checkout", {
  59  |     waitUntil: "domcontentloaded",
  60  |   });
  61  | 
  62  |   await expect(
  63  |     page.getByRole("heading", {
  64  |       name: "Secure Checkout",
  65  |       exact: true,
  66  |     })
  67  |   ).toBeVisible({
  68  |     timeout: 10000,
  69  |   });
  70  | }
  71  | 
  72  | async function prepareCheckout(page: Page) {
  73  |   await loginAsCustomer(page);
  74  |   await ensureCartProduct(page);
  75  |   await openCheckout(page);
  76  | }
  77  | 
  78  | async function fillValidAddress(page: Page) {
  79  |   await page.getByLabel("Full name").fill("Demo Customer");
  80  |   await page.getByRole("textbox", { name: "Phone" }).fill("9876543210");
  81  |   await page.getByLabel("Address").fill("123 Main Street");
  82  |   await page.getByLabel("City").fill("Guntur");
  83  |   await page.getByLabel("State").fill("Andhra Pradesh");
  84  |   await page.getByLabel("PIN code").fill("522001");
  85  | }
  86  | 
  87  | test.describe("Checkout E2E", () => {
  88  | 
  89  |   test("CHECKOUT-02: all delivery address fields render", async ({
  90  |     page,
  91  |   }) => {
  92  |     await prepareCheckout(page);
  93  | 
  94  |     await expect(page.getByLabel("Full name")).toBeVisible();
  95  |     await expect(page.getByRole("textbox", { name: "Phone" })).toBeVisible();
  96  |     await expect(page.getByLabel("Address")).toBeVisible();
  97  |     await expect(page.getByLabel("City")).toBeVisible();
  98  |     await expect(page.getByLabel("State")).toBeVisible();
  99  |     await expect(page.getByLabel("PIN code")).toBeVisible();
  100 |   });
  101 | 
  102 |   test("CHECKOUT-03: saved customer address is prefilled", async ({
  103 |     page,
  104 |   }) => {
  105 |     await loginAsCustomer(page);
  106 |     await openCheckout(page);
  107 | 
  108 |     await expect(page.getByLabel("Full name")).toHaveValue(
  109 |       "Demo Customer"
  110 |     );
  111 | 
  112 |     await expect(page.getByRole("textbox", { name: "Phone" })).toHaveValue(
  113 |       "9876543210"
  114 |     );
  115 | 
  116 |     await expect(page.getByLabel("City")).toHaveValue("Guntur");
  117 |     await expect(page.getByLabel("State")).toHaveValue(
  118 |       "Andhra Pradesh"
  119 |     );
  120 |   });
  121 | 
```