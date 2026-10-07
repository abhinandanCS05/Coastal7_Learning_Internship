# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 05-checkout.spec.ts >> Checkout E2E >> CHECKOUT-02: all delivery address fields render
- Location: e2e\05-checkout.spec.ts:89:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator:  getByRole('heading', { name: 'Secure Checkout', exact: true })
Expected: visible
Received: undefined

Call log:
  - Expect "toBeVisible" getByRole('heading', { name: 'Secure Checkout', exact: true }) with timeout 10000ms
  - waiting for getByRole('heading', { name: 'Secure Checkout', exact: true })
  - Protocol error (Runtime.callFunctionOn): Internal server error, session closed.

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
  21  |   await expect(page).toHaveURL(/\/app/);
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
> 67  |   ).toBeVisible({
      |     ^ Error: expect(locator).toBeVisible() failed
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
  122 |   test("CHECKOUT-04: empty full name is rejected", async ({ page }) => {
  123 |     await prepareCheckout(page);
  124 | 
  125 |     await page.getByLabel("Full name").fill("");
  126 | 
  127 |     await page.getByRole("button", {
  128 |       name: /place order/i,
  129 |     }).click();
  130 | 
  131 |     await expect(
  132 |       page.getByText("Full name must be at least 2 characters", {
  133 |         exact: true,
  134 |       })
  135 |     ).toBeVisible();
  136 |   });
  137 | 
  138 |   test("CHECKOUT-05: invalid phone is rejected", async ({ page }) => {
  139 |     await prepareCheckout(page);
  140 | 
  141 |     await page.getByRole("textbox", { name: "Phone" }).fill("1234567890");
  142 | 
  143 |     await page.getByRole("button", {
  144 |       name: /place order/i,
  145 |     }).click();
  146 | 
  147 |     await expect(
  148 |       page.getByText(
  149 |         "Enter a valid 10-digit Indian mobile number",
  150 |         { exact: true }
  151 |       )
  152 |     ).toBeVisible();
  153 |   });
  154 | 
  155 |   test("CHECKOUT-06: short address is rejected", async ({ page }) => {
  156 |     await prepareCheckout(page);
  157 | 
  158 |     await page.getByLabel("Address").fill("abc");
  159 | 
  160 |     await page.getByRole("button", {
  161 |       name: /place order/i,
  162 |     }).click();
  163 | 
  164 |     await expect(
  165 |       page.getByText(
  166 |         "Address must be at least 5 characters",
  167 |         { exact: true }
```