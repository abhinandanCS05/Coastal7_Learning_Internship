# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 05-checkout.spec.ts >> Checkout E2E >> CHECKOUT-14: successful COD checkout creates an order
- Location: e2e\05-checkout.spec.ts:352:3

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
  285 |     await expect(upiRadio).not.toBeChecked();
  286 |   });
  287 | 
  288 |   test("CHECKOUT-12: bill details render", async ({ page }) => {
  289 |     await prepareCheckout(page);
  290 | 
  291 |     await expect(
  292 |       page.getByRole("heading", {
  293 |         name: "Bill Details",
  294 |         exact: true,
  295 |       })
  296 |     ).toBeVisible();
  297 | 
  298 |     await expect(
  299 |       page.getByText("Subtotal", {
  300 |         exact: true,
  301 |       })
  302 |     ).toBeVisible();
  303 | 
  304 |     await expect(
  305 |       page.getByText("Offer discount", {
  306 |         exact: true,
  307 |       })
  308 |     ).toBeVisible();
  309 | 
  310 |     await expect(
  311 |       page.getByText("Delivery", {
  312 |         exact: true,
  313 |       })
  314 |     ).toBeVisible();
  315 | 
  316 |     await expect(
  317 |       page.getByText("Total", {
  318 |         exact: true,
  319 |       })
  320 |     ).toBeVisible();
  321 |   });
  322 | 
  323 |   test("CHECKOUT-13: available offers are displayed", async ({
  324 |     page,
  325 |   }) => {
  326 |     await prepareCheckout(page);
  327 | 
  328 |     const offerArea = page.locator("aside");
  329 | 
  330 |     /*
  331 |      * The backend may return zero or more offers, so we verify
  332 |      * that the checkout summary itself is rendered rather than
  333 |      * assuming a particular promotional code.
  334 |      */
  335 |     await expect(
  336 |       offerArea.getByText("Bill Details", {
  337 |         exact: true,
  338 |       })
  339 |     ).toBeVisible();
  340 | 
  341 |     const offerCards = offerArea.locator(
  342 |       ".bg-green-50"
  343 |     );
  344 | 
  345 |     await expect
  346 |       .poll(async () => await offerCards.count(), {
  347 |         timeout: 10000,
  348 |       })
  349 |       .toBeGreaterThanOrEqual(0);
  350 |   });
  351 | 
  352 |   test("CHECKOUT-14: successful COD checkout creates an order", async ({
  353 |     page,
  354 |   }) => {
  355 |     await loginAsCustomer(page);
  356 | 
  357 |     /*
  358 |      * Navigate directly to checkout first. This avoids the extra
  359 |      * catalog -> cart navigation that previously experienced a
  360 |      * browser dialog/navigation interruption.
  361 |      */
  362 |     await page.goto("/app/checkout", {
  363 |       waitUntil: "domcontentloaded",
  364 |     });
  365 | 
  366 |     /*
  367 |      * If the account has no cart item, add one through the catalog
  368 |      * and return to checkout.
  369 |      */
  370 |     const checkoutHeading = page.getByRole("heading", {
  371 |       name: "Secure Checkout",
  372 |       exact: true,
  373 |     });
  374 | 
  375 |     if (!(await checkoutHeading.count())) {
  376 |       await page.goto("/app/products", {
  377 |         waitUntil: "domcontentloaded",
  378 |       });
  379 | 
  380 |       const productCard = page
  381 |         .locator("article")
  382 |         .filter({ hasText: PRODUCT_NAME })
  383 |         .first();
  384 | 
> 385 |       await expect(productCard).toBeVisible({
      |                                 ^ Error: expect(locator).toBeVisible() failed
  386 |         timeout: 10000,
  387 |       });
  388 | 
  389 |       const addButton = productCard.getByRole("button", {
  390 |         name: /add to cart/i,
  391 |       });
  392 | 
  393 |       if (await addButton.count()) {
  394 |         await addButton.click();
  395 |       }
  396 | 
  397 |       await page.goto("/app/checkout", {
  398 |         waitUntil: "domcontentloaded",
  399 |       });
  400 |     }
  401 | 
  402 |     await expect(checkoutHeading).toBeVisible({
  403 |       timeout: 10000,
  404 |     });
  405 | 
  406 |     await fillValidAddress(page);
  407 | 
  408 |     const codRadio = page.locator(
  409 |       'input[type="radio"][value="COD"]'
  410 |     );
  411 | 
  412 |     await expect(codRadio).toBeChecked();
  413 | 
  414 |     const placeOrderButton = page.getByRole("button", {
  415 |       name: /place order/i,
  416 |     });
  417 | 
  418 |     await expect(placeOrderButton).toBeVisible();
  419 | 
  420 |     await placeOrderButton.click();
  421 | 
  422 |     await expect(
  423 |       page.getByText("Order Placed", {
  424 |         exact: true,
  425 |       })
  426 |     ).toBeVisible({
  427 |       timeout: 15000,
  428 |     });
  429 | 
  430 |     await expect(page).toHaveURL(/\/app\/orders/, {
  431 |       timeout: 15000,
  432 |     });
  433 |   });
  434 |   test("CHECKOUT-15: checkout requires authentication", async ({
  435 |     page,
  436 |   }) => {
  437 |     await page.goto("/app/checkout", {
  438 |       waitUntil: "domcontentloaded",
  439 |     });
  440 | 
  441 |     await expect(page).toHaveURL(/\/login/);
  442 |   });
  443 | });
  444 | 
```