# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 02-products.spec.ts >> Products & Catalog E2E >> PRODUCT-14: infinite scrolling loads additional products
- Location: e2e\02-products.spec.ts:313:3

# Error details

```
Error: expect(received).toBeGreaterThan(expected)

Expected: > 20
Received:   20

Call Log:
- Timeout 15000ms exceeded while waiting on the predicate
```

# Page snapshot

```yaml
- generic [ref=f1e2]:
  - button "Notifications" [ref=f1e4]
  - button "Support" [ref=f1e8]
  - generic [ref=f1e11]:
    - banner [ref=f1e12]:
      - generic [ref=f1e13]:
        - link "shopflow" [ref=f1e14] [cursor=pointer]:
          - /url: /app
        - textbox "Search products, categories and more..." [ref=f1e20]
        - navigation [ref=f1e21]:
          - link "Wishlist" [ref=f1e22] [cursor=pointer]:
            - /url: /app/wishlist
          - link "My Orders" [ref=f1e25] [cursor=pointer]:
            - /url: /app/orders
          - link "Cart" [ref=f1e30] [cursor=pointer]:
            - /url: /app/cart
          - button "Toggle theme" [ref=f1e35]
          - generic [ref=f1e38]:
            - generic [ref=f1e42]: Demo Customer
            - button "Logout" [ref=f1e43]
    - main [ref=f1e47]:
      - main [ref=f1e48]:
        - generic [ref=f1e49]:
          - generic [ref=f1e50]:
            - paragraph [ref=f1e51]: SHOP / CATALOG
            - heading "Discover products" [level=1] [ref=f1e52]
            - paragraph [ref=f1e53]: Showing 20 of 123 products
          - combobox [ref=f1e54]:
            - 'option "Sort: Relevance" [selected]'
            - 'option "Price: Low to High"'
            - 'option "Price: High to Low"'
            - option "Customer Rating"
            - option "Best Discount"
            - option "Newest"
        - generic [ref=f1e55]:
          - complementary [ref=f1e56]:
            - generic [ref=f1e57]:
              - generic [ref=f1e58]: Filters
              - button "Clear" [ref=f1e60]
            - generic [ref=f1e61]:
              - text: Search
              - textbox "Search" [ref=f1e62]
            - generic [ref=f1e63]:
              - text: Category
              - combobox "Category" [ref=f1e64]:
                - option "All categories" [selected]
                - option "Electronics"
                - option "Clothing"
                - option "Home & Kitchen"
                - option "Beauty & Personal Care"
                - option "Sports & Fitness"
                - option "Books & Stationery"
                - option "Personal Care"
                - option "accesories"
                - option "Cycles"
            - generic [ref=f1e65]:
              - textbox "Min" [ref=f1e66]:
                - /placeholder: "Min "
              - textbox "Max" [ref=f1e67]:
                - /placeholder: "Max "
          - generic [ref=f1e69]:
            - article [ref=f1e70]:
              - link "Nova X Pro 5G Limited Stock" [ref=f1e71] [cursor=pointer]:
                - /url: /app/products/1
                - generic [ref=f1e72]:
                  - img "Nova X Pro 5G" [ref=f1e73]
                  - generic [ref=f1e74]: Limited Stock
              - generic [ref=f1e75]:
                - generic [ref=f1e76]: Electronics � Phones
                - generic [ref=f1e77]:
                  - link "Nova X Pro 5G" [ref=f1e78] [cursor=pointer]:
                    - /url: /app/products/1
                  - button "Remove from wishlist" [ref=f1e79]
                - generic [ref=f1e82]:
                  - text: "4.5"
                  - generic [ref=f1e85]: (700)
                - generic [ref=f1e86]:
                  - generic [ref=f1e87]: 1,499
                  - generic [ref=f1e88]: 1,873.75
                  - generic [ref=f1e89]: 20% off
                - paragraph [ref=f1e90]: Save ₹374 today
                - button "Add to cart" [ref=f1e91]
            - article [ref=f1e96]:
              - link "PixelEdge 9 Only 0 left Limited Stock" [ref=f1e97] [cursor=pointer]:
                - /url: /app/products/2
                - generic [ref=f1e98]:
                  - img "PixelEdge 9" [ref=f1e99]
                  - generic [ref=f1e100]: Only 0 left
                  - generic [ref=f1e101]: Limited Stock
              - generic [ref=f1e102]:
                - generic [ref=f1e103]: Electronics � Phones
                - generic [ref=f1e104]:
                  - link "PixelEdge 9" [ref=f1e105] [cursor=pointer]:
                    - /url: /app/products/2
                  - button "Remove from wishlist" [ref=f1e106]
                - generic [ref=f1e109]:
                  - text: "4.1"
                  - generic [ref=f1e112]: (562)
                - generic [ref=f1e113]:
                  - generic [ref=f1e114]: "999"
                  - generic [ref=f1e115]: 1,198.8
                  - generic [ref=f1e116]: 17% off
                - paragraph [ref=f1e117]: Save ₹199 today
                - button "Add to cart" [ref=f1e118]
            - article [ref=f1e123]:
              - link [ref=f1e124] [cursor=pointer]:
                - /url: /app/products/3
                - img "GalaxyMax Ultra" [ref=f1e126]
              - generic [ref=f1e127]:
                - generic [ref=f1e128]: Electronics � Phones
                - generic [ref=f1e129]:
                  - link "GalaxyMax Ultra" [ref=f1e130] [cursor=pointer]:
                    - /url: /app/products/3
                  - button "Add to wishlist" [ref=f1e131]
                - generic [ref=f1e134]:
                  - text: "4"
                  - generic [ref=f1e137]: (147)
                - generic [ref=f1e138]:
                  - generic [ref=f1e139]: 19,999
                  - generic [ref=f1e140]: 23,998.8
                  - generic [ref=f1e141]: 17% off
                - paragraph [ref=f1e142]: Save ₹3999 today
                - button "Add to cart" [ref=f1e143]
            - article [ref=f1e148]:
              - link [ref=f1e149] [cursor=pointer]:
                - /url: /app/products/4
                - img "AeroPhone 12" [ref=f1e151]
              - generic [ref=f1e152]:
                - generic [ref=f1e153]: Electronics � Phones
                - generic [ref=f1e154]:
                  - link "AeroPhone 12" [ref=f1e155] [cursor=pointer]:
                    - /url: /app/products/4
                  - button "Add to wishlist" [ref=f1e156]
                - generic [ref=f1e159]:
                  - text: "4.7"
                  - generic [ref=f1e162]: (104)
                - generic [ref=f1e163]:
                  - generic [ref=f1e164]: 19,999
                  - generic [ref=f1e165]: 22,998.85
                  - generic [ref=f1e166]: 13% off
                - paragraph [ref=f1e167]: Save ₹2999 today
                - button "Add to cart" [ref=f1e168]
            - article [ref=f1e173]:
              - link [ref=f1e174] [cursor=pointer]:
                - /url: /app/products/5
                - img "ProBook Air 14" [ref=f1e176]
              - generic [ref=f1e177]:
                - generic [ref=f1e178]: Electronics � Laptops
                - generic [ref=f1e179]:
                  - link "ProBook Air 14" [ref=f1e180] [cursor=pointer]:
                    - /url: /app/products/5
                  - button "Add to wishlist" [ref=f1e181]
                - generic [ref=f1e184]:
                  - text: "4.6"
                  - generic [ref=f1e187]: (160)
                - generic [ref=f1e188]:
                  - generic [ref=f1e189]: 19,999
                  - generic [ref=f1e190]: 24,998.75
                  - generic [ref=f1e191]: 20% off
                - paragraph [ref=f1e192]: Save ₹4999 today
                - button "Add to cart" [ref=f1e193]
            - article [ref=f1e198]:
              - link [ref=f1e199] [cursor=pointer]:
                - /url: /app/products/6
                - img "UltraNote 15" [ref=f1e201]
              - generic [ref=f1e202]:
                - generic [ref=f1e203]: Electronics � Laptops
                - generic [ref=f1e204]:
                  - link "UltraNote 15" [ref=f1e205] [cursor=pointer]:
                    - /url: /app/products/6
                  - button "Add to wishlist" [ref=f1e206]
                - generic [ref=f1e209]:
                  - text: "4.7"
                  - generic [ref=f1e212]: (516)
                - generic [ref=f1e213]:
                  - generic [ref=f1e214]: 12,999
                  - generic [ref=f1e215]: 16,248.75
                  - generic [ref=f1e216]: 20% off
                - paragraph [ref=f1e217]: Save ₹3249 today
                - button "Add to cart" [ref=f1e218]
            - article [ref=f1e223]:
              - link "CreatorBook 16 Bestseller" [ref=f1e224] [cursor=pointer]:
                - /url: /app/products/7
                - generic [ref=f1e225]:
                  - img "CreatorBook 16" [ref=f1e226]
                  - generic [ref=f1e227]: Bestseller
              - generic [ref=f1e228]:
                - generic [ref=f1e229]: Electronics � Laptops
                - generic [ref=f1e230]:
                  - link "CreatorBook 16" [ref=f1e231] [cursor=pointer]:
                    - /url: /app/products/7
                  - button "Remove from wishlist" [ref=f1e232]
                - generic [ref=f1e235]:
                  - text: "4.7"
                  - generic [ref=f1e238]: (671)
                - generic [ref=f1e239]:
                  - generic [ref=f1e240]: 29,999
                  - generic [ref=f1e241]: 38,998.7
                  - generic [ref=f1e242]: 23% off
                - paragraph [ref=f1e243]: Save ₹8999 today
                - button "Add to cart" [ref=f1e244]
            - article [ref=f1e249]:
              - link [ref=f1e250] [cursor=pointer]:
                - /url: /app/products/8
                - img "WorkMate 13" [ref=f1e252]
              - generic [ref=f1e253]:
                - generic [ref=f1e254]: Electronics � Laptops
                - generic [ref=f1e255]:
                  - link "WorkMate 13" [ref=f1e256] [cursor=pointer]:
                    - /url: /app/products/8
                  - button "Add to wishlist" [ref=f1e257]
                - generic [ref=f1e260]:
                  - text: "4.7"
                  - generic [ref=f1e263]: (835)
                - generic [ref=f1e264]:
                  - generic [ref=f1e265]: 1,999
                  - generic [ref=f1e266]: 2,298.85
                  - generic [ref=f1e267]: 13% off
                - paragraph [ref=f1e268]: Save ₹299 today
                - button "Add to cart" [ref=f1e269]
            - article [ref=f1e274]:
              - link [ref=f1e275] [cursor=pointer]:
                - /url: /app/products/9
                - img "Vision 43 4K" [ref=f1e277]
              - generic [ref=f1e278]:
                - generic [ref=f1e279]: Electronics � Televisions
                - generic [ref=f1e280]:
                  - link "Vision 43 4K" [ref=f1e281] [cursor=pointer]:
                    - /url: /app/products/9
                  - button "Add to wishlist" [ref=f1e282]
                - generic [ref=f1e285]:
                  - text: "4.4"
                  - generic [ref=f1e288]: (784)
                - generic [ref=f1e289]:
                  - generic [ref=f1e290]: 6,999
                  - generic [ref=f1e291]: 8,748.75
                  - generic [ref=f1e292]: 20% off
                - paragraph [ref=f1e293]: Save ₹1749 today
                - button "Add to cart" [ref=f1e294]
            - article [ref=f1e299]:
              - link [ref=f1e300] [cursor=pointer]:
                - /url: /app/products/10
                - img "Cinema 55 QLED" [ref=f1e302]
              - generic [ref=f1e303]:
                - generic [ref=f1e304]: Electronics � Televisions
                - generic [ref=f1e305]:
                  - link "Cinema 55 QLED" [ref=f1e306] [cursor=pointer]:
                    - /url: /app/products/10
                  - button "Add to wishlist" [ref=f1e307]
                - generic [ref=f1e310]:
                  - text: "4.4"
                  - generic [ref=f1e313]: (318)
                - generic [ref=f1e314]:
                  - generic [ref=f1e315]: "999"
                  - generic [ref=f1e316]: 1,298.7
                  - generic [ref=f1e317]: 23% off
                - paragraph [ref=f1e318]: Save ₹299 today
                - button "Add to cart" [ref=f1e319]
            - article [ref=f1e324]:
              - link [ref=f1e325] [cursor=pointer]:
                - /url: /app/products/11
                - img "ViewMax 65" [ref=f1e327]
              - generic [ref=f1e328]:
                - generic [ref=f1e329]: Electronics � Televisions
                - generic [ref=f1e330]:
                  - link "ViewMax 65" [ref=f1e331] [cursor=pointer]:
                    - /url: /app/products/11
                  - button "Add to wishlist" [ref=f1e332]
                - generic [ref=f1e335]:
                  - text: "4.3"
                  - generic [ref=f1e338]: (398)
                - generic [ref=f1e339]:
                  - generic [ref=f1e340]: 1,299
                  - generic [ref=f1e341]: 1,558.8
                  - generic [ref=f1e342]: 17% off
                - paragraph [ref=f1e343]: Save ₹259 today
                - button "Add to cart" [ref=f1e344]
            - article [ref=f1e349]:
              - link [ref=f1e350] [cursor=pointer]:
                - /url: /app/products/12
                - img "SmartTV 50" [ref=f1e352]
              - generic [ref=f1e353]:
                - generic [ref=f1e354]: Electronics � Televisions
                - generic [ref=f1e355]:
                  - link "SmartTV 50" [ref=f1e356] [cursor=pointer]:
                    - /url: /app/products/12
                  - button "Add to wishlist" [ref=f1e357]
                - generic [ref=f1e360]:
                  - text: "4.3"
                  - generic [ref=f1e363]: (151)
                - generic [ref=f1e364]:
                  - generic [ref=f1e365]: 2,999
                  - generic [ref=f1e366]: 3,748.75
                  - generic [ref=f1e367]: 20% off
                - paragraph [ref=f1e368]: Save ₹749 today
                - button "Add to cart" [ref=f1e369]
            - article [ref=f1e374]:
              - link [ref=f1e375] [cursor=pointer]:
                - /url: /app/products/13
                - img "Smart Speaker" [ref=f1e377]
              - generic [ref=f1e378]:
                - generic [ref=f1e379]: Electronics � Home Gadgets
                - generic [ref=f1e380]:
                  - link "Smart Speaker" [ref=f1e381] [cursor=pointer]:
                    - /url: /app/products/13
                  - button "Add to wishlist" [ref=f1e382]
                - generic [ref=f1e385]:
                  - text: "4.2"
                  - generic [ref=f1e388]: (259)
                - generic [ref=f1e389]:
                  - generic [ref=f1e390]: 4,999
                  - generic [ref=f1e391]: 6,498.7
                  - generic [ref=f1e392]: 23% off
                - paragraph [ref=f1e393]: Save ₹1499 today
                - button "Add to cart" [ref=f1e394]
            - article [ref=f1e399]:
              - link "Robot Vacuum Bestseller" [ref=f1e400] [cursor=pointer]:
                - /url: /app/products/14
                - generic [ref=f1e401]:
                  - img "Robot Vacuum" [ref=f1e402]
                  - generic [ref=f1e403]: Bestseller
              - generic [ref=f1e404]:
                - generic [ref=f1e405]: Electronics � Home Gadgets
                - generic [ref=f1e406]:
                  - link "Robot Vacuum" [ref=f1e407] [cursor=pointer]:
                    - /url: /app/products/14
                  - button "Add to wishlist" [ref=f1e408]
                - generic [ref=f1e411]:
                  - text: "4.1"
                  - generic [ref=f1e414]: (458)
                - generic [ref=f1e415]:
                  - generic [ref=f1e416]: 29,999
                  - generic [ref=f1e417]: 35,998.8
                  - generic [ref=f1e418]: 17% off
                - paragraph [ref=f1e419]: Save ₹5999 today
                - button "Add to cart" [ref=f1e420]
            - article [ref=f1e425]:
              - link [ref=f1e426] [cursor=pointer]:
                - /url: /app/products/15
                - img "Air Purifier" [ref=f1e428]
              - generic [ref=f1e429]:
                - generic [ref=f1e430]: Electronics � Home Gadgets
                - generic [ref=f1e431]:
                  - link "Air Purifier" [ref=f1e432] [cursor=pointer]:
                    - /url: /app/products/15
                  - button "Add to wishlist" [ref=f1e433]
                - generic [ref=f1e436]:
                  - text: "4"
                  - generic [ref=f1e439]: (452)
                - generic [ref=f1e440]:
                  - generic [ref=f1e441]: 6,999
                  - generic [ref=f1e442]: 9,098.7
                  - generic [ref=f1e443]: 23% off
                - paragraph [ref=f1e444]: Save ₹2099 today
                - button "Add to cart" [ref=f1e445]
            - article [ref=f1e450]:
              - link "Smart Display Only 9 left Limited Stock" [ref=f1e451] [cursor=pointer]:
                - /url: /app/products/16
                - generic [ref=f1e452]:
                  - img "Smart Display" [ref=f1e453]
                  - generic [ref=f1e454]: Only 9 left
                  - generic [ref=f1e455]: Limited Stock
              - generic [ref=f1e456]:
                - generic [ref=f1e457]: Electronics � Home Gadgets
                - generic [ref=f1e458]:
                  - link "Smart Display" [ref=f1e459] [cursor=pointer]:
                    - /url: /app/products/16
                  - button "Add to wishlist" [ref=f1e460]
                - generic [ref=f1e463]:
                  - text: "4.1"
                  - generic [ref=f1e466]: (843)
                - generic [ref=f1e467]:
                  - generic [ref=f1e468]: 29,999
                  - generic [ref=f1e469]: 34,498.85
                  - generic [ref=f1e470]: 13% off
                - paragraph [ref=f1e471]: Save ₹4499 today
                - button "Add to cart" [ref=f1e472]
            - article [ref=f1e477]:
              - link [ref=f1e478] [cursor=pointer]:
                - /url: /app/products/17
                - img "Wireless Earbuds" [ref=f1e480]
              - generic [ref=f1e481]:
                - generic [ref=f1e482]: Electronics � Accessories
                - generic [ref=f1e483]:
                  - link "Wireless Earbuds" [ref=f1e484] [cursor=pointer]:
                    - /url: /app/products/17
                  - button "Add to wishlist" [ref=f1e485]
                - generic [ref=f1e488]:
                  - text: "4.1"
                  - generic [ref=f1e491]: (441)
                - generic [ref=f1e492]:
                  - generic [ref=f1e493]: 8,999
                  - generic [ref=f1e494]: 11,698.7
                  - generic [ref=f1e495]: 23% off
                - paragraph [ref=f1e496]: Save ₹2699 today
                - button "Add to cart" [ref=f1e497]
            - article [ref=f1e502]:
              - link [ref=f1e503] [cursor=pointer]:
                - /url: /app/products/18
                - img "Mechanical Keyboard" [ref=f1e505]
              - generic [ref=f1e506]:
                - generic [ref=f1e507]: Electronics � Accessories
                - generic [ref=f1e508]:
                  - link "Mechanical Keyboard" [ref=f1e509] [cursor=pointer]:
                    - /url: /app/products/18
                  - button "Add to wishlist" [ref=f1e510]
                - generic [ref=f1e513]:
                  - text: "4.2"
                  - generic [ref=f1e516]: (892)
                - generic [ref=f1e517]:
                  - generic [ref=f1e518]: 8,999
                  - generic [ref=f1e519]: 11,248.75
                  - generic [ref=f1e520]: 20% off
                - paragraph [ref=f1e521]: Save ₹2249 today
                - button "Add to cart" [ref=f1e522]
            - article [ref=f1e527]:
              - link [ref=f1e528] [cursor=pointer]:
                - /url: /app/products/19
                - img "USB-C Hub" [ref=f1e530]
              - generic [ref=f1e531]:
                - generic [ref=f1e532]: Electronics � Accessories
                - generic [ref=f1e533]:
                  - link "USB-C Hub" [ref=f1e534] [cursor=pointer]:
                    - /url: /app/products/19
                  - button "Add to wishlist" [ref=f1e535]
                - generic [ref=f1e538]:
                  - text: "4.6"
                  - generic [ref=f1e541]: (158)
                - generic [ref=f1e542]:
                  - generic [ref=f1e543]: 6,999
                  - generic [ref=f1e544]: 8,748.75
                  - generic [ref=f1e545]: 20% off
                - paragraph [ref=f1e546]: Save ₹1749 today
                - button "Add to cart" [ref=f1e547]
            - article [ref=f1e552]:
              - link [ref=f1e553] [cursor=pointer]:
                - /url: /app/products/20
                - img "Power Bank" [ref=f1e555]
              - generic [ref=f1e556]:
                - generic [ref=f1e557]: Electronics � Accessories
                - generic [ref=f1e558]:
                  - link "Power Bank" [ref=f1e559] [cursor=pointer]:
                    - /url: /app/products/20
                  - button "Add to wishlist" [ref=f1e560]
                - generic [ref=f1e563]:
                  - text: "4.2"
                  - generic [ref=f1e566]: (650)
                - generic [ref=f1e567]:
                  - generic [ref=f1e568]: 29,999
                  - generic [ref=f1e569]: 35,998.8
                  - generic [ref=f1e570]: 17% off
                - paragraph [ref=f1e571]: Save ₹5999 today
                - button "Add to cart" [ref=f1e572]
    - contentinfo [ref=f1e578]: © 2026 ShopFlow · Smart shopping, simple checkout.
```

# Test source

```ts
  237 |     ).toBeVisible();
  238 |   });
  239 | 
  240 |   test("PRODUCT-11: price high-to-low sorting works", async ({ page }) => {
  241 |     await openProducts(page);
  242 | 
  243 |     const sort = page.locator("select").first();
  244 | 
  245 |     await sort.selectOption("price_desc");
  246 | 
  247 |     await expect(sort).toHaveValue("price_desc");
  248 | 
  249 |     await expect(
  250 |       page.locator("article").first()
  251 |     ).toBeVisible();
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
> 337 |       .toBeGreaterThan(initialCount);
      |        ^ Error: expect(received).toBeGreaterThan(expected)
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
  352 |       expect(dialog.message()).toMatch(/added to cart/i);
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