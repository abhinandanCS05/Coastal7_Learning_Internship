# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 02-products.spec.ts >> Products & Catalog E2E >> PRODUCT-15: product can be added to cart from listing
- Location: e2e\02-products.spec.ts:340:3

# Error details

```
Error: expect(received).toMatch(expected)

Expected pattern: /added to cart/i
Received string:  "Only 0 left in stock"
```

# Test source

```ts
  252 |   });
  253 | 
  254 |   test("PRODUCT-12: product card opens product details", async ({
  255 |     page,
  256 |   }) => {
  257 |     await openProducts(page);
  258 | 
  259 |     const firstCard = page.locator("article").first();
  260 | 
  261 |     const productName = await firstCard
  262 |       .locator("a")
  263 |       .last()
  264 |       .innerText();
  265 | 
  266 |     await firstCard.locator("a").first().click();
  267 | 
  268 |     await expect(page).toHaveURL(/\/app\/products\/\d+/);
  269 | 
  270 |     await expect(
  271 |       page.getByRole("link", { name: /back to products/i })
  272 |     ).toBeVisible();
  273 | 
  274 |     await expect(
  275 |       page.getByRole("heading", { level: 1 })
  276 |     ).toBeVisible();
  277 | 
  278 |     expect(productName.trim().length).toBeGreaterThan(0);
  279 |   });
  280 | 
  281 |   test("PRODUCT-13: product details displays price and purchase controls", async ({
  282 |     page,
  283 |   }) => {
  284 |     await openProducts(page);
  285 | 
  286 |     await page.locator("article").first().locator("a").first().click();
  287 | 
  288 |     await expect(page).toHaveURL(/\/app\/products\/\d+/);
  289 | 
  290 |     await expect(
  291 |       page.getByRole("link", { name: /back to products/i })
  292 |     ).toBeVisible();
  293 | 
  294 |     const details = page.locator("main");
  295 | 
  296 |     await expect(
  297 |       details.getByRole("heading", { level: 1 })
  298 |     ).toBeVisible();
  299 | 
  300 |     await expect(
  301 |       details.getByRole("button", { name: /add to cart/i })
  302 |     ).toBeVisible();
  303 | 
  304 |     await expect(
  305 |       details.getByText(/% OFF/i)
  306 |     ).toBeVisible();
  307 | 
  308 |     await expect(
  309 |       details.getByText(/secure checkout/i)
  310 |     ).toBeVisible();
  311 |   });
  312 | 
  313 |   test("PRODUCT-14: infinite scrolling loads additional products", async ({
  314 |     page,
  315 |   }) => {
  316 |     await openProducts(page);
  317 | 
  318 |     const initialCount = await page.locator("article").count();
  319 | 
  320 |     expect(initialCount).toBeGreaterThan(0);
  321 | 
  322 |     await page.evaluate(() => {
  323 |       window.scrollTo({
  324 |         top: document.body.scrollHeight,
  325 |         behavior: "instant",
  326 |       });
  327 |     });
  328 | 
  329 |     await expect
  330 |       .poll(
  331 |         async () => page.locator("article").count(),
  332 |         {
  333 |           timeout: 15000,
  334 |           intervals: [500, 1000, 1500],
  335 |         }
  336 |       )
  337 |       .toBeGreaterThan(initialCount);
  338 |   });
  339 | 
  340 |   test("PRODUCT-15: product can be added to cart from listing", async ({
  341 |     page,
  342 |   }) => {
  343 |     await openProducts(page);
  344 | 
  345 |     const firstCard = page.locator("article").first();
  346 | 
  347 |     await expect(
  348 |       firstCard.getByRole("button", { name: /add to cart/i })
  349 |     ).toBeVisible();
  350 | 
  351 |     page.once("dialog", async (dialog) => {
> 352 |       expect(dialog.message()).toMatch(/added to cart/i);
      |                                ^ Error: expect(received).toMatch(expected)
  353 |       await dialog.accept();
  354 |     });
  355 | 
  356 |     await firstCard
  357 |       .getByRole("button", { name: /add to cart/i })
  358 |       .click();
  359 | 
  360 |     await page.waitForTimeout(1000);
  361 | 
  362 |     await expect(page).toHaveURL(/\/app\/products/);
  363 |   });
  364 | });
  365 | 
```