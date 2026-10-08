# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: shopflow.spec.ts >> ShopFlow Customer E2E >> E2E-2: product search and cart workflow
- Location: e2e\shopflow.spec.ts:270:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: /shopping cart/i })
Expected: visible
Timeout: 15000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByRole('heading', { name: /shopping cart/i }) with timeout 15000ms
  - waiting for getByRole('heading', { name: /shopping cart/i })

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
    - link "Cart":
      - /url: /app/cart
      - img
    - button "Toggle theme":
      - img
    - img
    - text: Demo Customer
    - button "Logout":
      - img
- main:
  - main:
    - img
    - heading "Your cart is empty" [level=1]
    - link "Start shopping":
      - /url: /app/products
- contentinfo: © 2026 ShopFlow · Smart shopping, simple checkout.
```

# Test source

```ts
  39  |       { timeout: 15000 }
  40  |     );
  41  | 
  42  |     const token = await page.evaluate(() =>
  43  |       localStorage.getItem("shopflow_token")
  44  |     );
  45  | 
  46  |     expect(token).toBeTruthy();
  47  |   }
  48  | 
  49  | 
  50  |   async function openProductDetails(page) {
  51  |     // Navigate to the real products page.
  52  |     await page.goto("/app/products?search=Phone", {
  53  |       waitUntil: "domcontentloaded",
  54  |     });
  55  | 
  56  |     await expect(
  57  |       page.getByRole("heading", {
  58  |         name: /discover products/i,
  59  |       })
  60  |     ).toBeVisible({
  61  |       timeout: 15000,
  62  |     });
  63  | 
  64  |     // Products.jsx renders product detail links as:
  65  |     // /app/products/<product-id>
  66  |     //
  67  |     // IMPORTANT:
  68  |     // We explicitly require a dynamic ID segment.
  69  |     const productLinks = page.locator(
  70  |       'a[href^="/app/products/"]'
  71  |     );
  72  | 
  73  |     await expect(productLinks.first()).toBeVisible({
  74  |       timeout: 15000,
  75  |     });
  76  | 
  77  |     const href = await productLinks.first().getAttribute("href");
  78  | 
  79  |     expect(href).toMatch(
  80  |       /^\/app\/products\/[^/]+$/
  81  |     );
  82  | 
  83  |     // Navigate directly to the exact dynamic route exposed
  84  |     // by the application's React Router.
  85  |     await page.goto(href!, {
  86  |       waitUntil: "domcontentloaded",
  87  |     });
  88  | 
  89  |     await expect(page).toHaveURL(
  90  |       new RegExp(
  91  |         "^.*/app/products/[^/?]+$"
  92  |       ),
  93  |       {
  94  |         timeout: 15000,
  95  |       }
  96  |     );
  97  | 
  98  |     // These elements uniquely identify ProductDetails.jsx.
  99  |     await expect(
  100 |       page.getByRole("link", {
  101 |         name: /back to products/i,
  102 |       })
  103 |     ).toBeVisible({
  104 |       timeout: 15000,
  105 |     });
  106 | 
  107 |     const addToCart = page.getByRole("button", {
  108 |       name: "Add to Cart",
  109 |       exact: true,
  110 |     });
  111 | 
  112 |     await expect(addToCart).toHaveCount(1);
  113 | 
  114 |     await expect(addToCart).toBeVisible();
  115 | 
  116 |     return addToCart;
  117 |   }
  118 | 
  119 | 
  120 |   async function addProductToCart(page) {
  121 |     const addToCart = await openProductDetails(page);
  122 | 
  123 |     // ProductDetails performs the real POST /cart/items.
  124 |     // window.alert is stubbed, so no native dialog blocks us.
  125 |     await addToCart.click();
  126 | 
  127 |     // Give React/API request a moment to complete.
  128 |     await page.waitForTimeout(700);
  129 | 
  130 |     // Go through the actual customer cart route.
  131 |     await page.goto("/app/cart", {
  132 |       waitUntil: "domcontentloaded",
  133 |     });
  134 | 
  135 |     await expect(
  136 |       page.getByRole("heading", {
  137 |         name: /shopping cart/i,
  138 |       })
> 139 |     ).toBeVisible({
      |       ^ Error: expect(locator).toBeVisible() failed
  140 |       timeout: 15000,
  141 |     });
  142 |   }
  143 | 
  144 | 
  145 |   // ============================================================
  146 |   // E2E-1
  147 |   // Login → Search → Product → Cart → Checkout → Order
  148 |   // ============================================================
  149 | 
  150 |   test(
  151 |     "E2E-1: complete customer purchase journey",
  152 |     async ({ page }) => {
  153 | 
  154 |       // 1. Authentication
  155 |       await loginAsCustomer(page);
  156 | 
  157 |       // 2. Product → Cart
  158 |       await addProductToCart(page);
  159 | 
  160 |       // 3. Cart verification
  161 |       await expect(
  162 |         page.getByText("Order Summary", {
  163 |           exact: true,
  164 |         })
  165 |       ).toBeVisible();
  166 | 
  167 |       const checkout = page.getByRole("button", {
  168 |         name: /proceed to checkout/i,
  169 |       });
  170 | 
  171 |       await expect(checkout).toBeVisible();
  172 | 
  173 |       // 4. Checkout
  174 |       await checkout.click();
  175 | 
  176 |       await expect(page).toHaveURL(
  177 |         /\/app\/checkout/,
  178 |         {
  179 |           timeout: 15000,
  180 |         }
  181 |       );
  182 | 
  183 |       await expect(
  184 |         page.getByRole("heading", {
  185 |           name: /secure checkout/i,
  186 |         })
  187 |       ).toBeVisible({
  188 |         timeout: 15000,
  189 |       });
  190 | 
  191 |       // 5. Address
  192 |       await page.getByLabel("Full Name").fill(
  193 |         "Demo Customer"
  194 |       );
  195 | 
  196 |       await page.getByRole("textbox", { name: "Phone", exact: true }).fill(
  197 |         "9876543210"
  198 |       );
  199 | 
  200 |       await page.getByLabel("Address").fill(
  201 |         "123 ShopFlow Street"
  202 |       );
  203 | 
  204 |       await page.getByLabel("City").fill(
  205 |         "Guntur"
  206 |       );
  207 | 
  208 |       await page.getByLabel("State").fill(
  209 |         "Andhra Pradesh"
  210 |       );
  211 | 
  212 |       await page.getByRole("textbox", { name: "PIN code", exact: true }).fill(
  213 |         "522001"
  214 |       );
  215 | 
  216 |       // 6. Cash on Delivery
  217 |       const cod = page
  218 |         .locator("label")
  219 |         .filter({
  220 |           hasText: "Cash on Delivery",
  221 |         })
  222 |         .first();
  223 | 
  224 |       await expect(cod).toBeVisible({
  225 |         timeout: 10000,
  226 |       });
  227 | 
  228 |       await cod.click();
  229 | 
  230 |       // 7. Place order
  231 |       const placeOrder = page.getByRole("button", {
  232 |         name: /place order/i,
  233 |       });
  234 | 
  235 |       await expect(placeOrder).toBeVisible();
  236 | 
  237 |       await placeOrder.click();
  238 | 
  239 |       // Checkout.jsx redirects here after POST /orders.
```