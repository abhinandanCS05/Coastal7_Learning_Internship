import { test, expect } from "@playwright/test";

test.describe("ShopFlow Customer E2E", () => {

  test.beforeEach(async ({ page }) => {
    // ProductDetails.jsx calls alert("Added to cart").
    // Stub it before the app loads so the native browser dialog
    // cannot interrupt subsequent navigation.
    await page.addInitScript(() => {
      window.alert = () => {};
    });
  });

  async function loginAsCustomer(page) {
    await page.goto("/login", {
      waitUntil: "domcontentloaded",
    });

    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();

    await page.getByLabel("Email").fill("demo@shopflow.com");
    await page.getByLabel("Password").fill("Demo@123");

    const customer = page.getByText("Customer", {
      exact: true,
    }).first();

    if (await customer.isVisible().catch(() => false)) {
      await customer.click();
    }

    await page.getByRole("button", {
      name: /sign in/i,
    }).click();

    await expect(page).toHaveURL(
      /\/app(?:\/)?$/,
      { timeout: 15000 }
    );

    const token = await page.evaluate(() =>
      localStorage.getItem("shopflow_token")
    );

    expect(token).toBeTruthy();
  }


  async function openProductDetails(page) {
    // Navigate to the real products page.
    await page.goto("/app/products?search=Phone", {
      waitUntil: "domcontentloaded",
    });

    await expect(
      page.getByRole("heading", {
        name: /discover products/i,
      })
    ).toBeVisible({
      timeout: 15000,
    });

    // Products.jsx renders product detail links as:
    // /app/products/<product-id>
    //
    // IMPORTANT:
    // We explicitly require a dynamic ID segment.
    const productLinks = page.locator(
      'a[href^="/app/products/"]'
    );

    await expect(productLinks.first()).toBeVisible({
      timeout: 15000,
    });

    const href = await productLinks.first().getAttribute("href");

    expect(href).toMatch(
      /^\/app\/products\/[^/]+$/
    );

    // Navigate directly to the exact dynamic route exposed
    // by the application's React Router.
    await page.goto(href!, {
      waitUntil: "domcontentloaded",
    });

    await expect(page).toHaveURL(
      new RegExp(
        "^.*/app/products/[^/?]+$"
      ),
      {
        timeout: 15000,
      }
    );

    // These elements uniquely identify ProductDetails.jsx.
    await expect(
      page.getByRole("link", {
        name: /back to products/i,
      })
    ).toBeVisible({
      timeout: 15000,
    });

    const addToCart = page.getByRole("button", {
      name: "Add to Cart",
      exact: true,
    });

    await expect(addToCart).toHaveCount(1);

    await expect(addToCart).toBeVisible();

    return addToCart;
  }


  async function addProductToCart(page) {
    const addToCart = await openProductDetails(page);

    // ProductDetails performs the real POST /cart/items.
    // window.alert is stubbed, so no native dialog blocks us.
    await addToCart.click();

    // Give React/API request a moment to complete.
    await page.waitForTimeout(700);

    // Go through the actual customer cart route.
    await page.goto("/app/cart", {
      waitUntil: "domcontentloaded",
    });

    await expect(
      page.getByRole("heading", {
        name: /shopping cart/i,
      })
    ).toBeVisible({
      timeout: 15000,
    });
  }


  // ============================================================
  // E2E-1
  // Login → Search → Product → Cart → Checkout → Order
  // ============================================================

  test(
    "E2E-1: complete customer purchase journey",
    async ({ page }) => {

      // 1. Authentication
      await loginAsCustomer(page);

      // 2. Product → Cart
      await addProductToCart(page);

      // 3. Cart verification
      await expect(
        page.getByText("Order Summary", {
          exact: true,
        })
      ).toBeVisible();

      const checkout = page.getByRole("button", {
        name: /proceed to checkout/i,
      });

      await expect(checkout).toBeVisible();

      // 4. Checkout
      await checkout.click();

      await expect(page).toHaveURL(
        /\/app\/checkout/,
        {
          timeout: 15000,
        }
      );

      await expect(
        page.getByRole("heading", {
          name: /secure checkout/i,
        })
      ).toBeVisible({
        timeout: 15000,
      });

      // 5. Address
      await page.getByLabel("Full Name").fill(
        "Demo Customer"
      );

      await page.getByRole("textbox", { name: "Phone", exact: true }).fill(
        "9876543210"
      );

      await page.getByLabel("Address").fill(
        "123 ShopFlow Street"
      );

      await page.getByLabel("City").fill(
        "Guntur"
      );

      await page.getByLabel("State").fill(
        "Andhra Pradesh"
      );

      await page.getByRole("textbox", { name: "PIN code", exact: true }).fill(
        "522001"
      );

      // 6. Cash on Delivery
      const cod = page
        .locator("label")
        .filter({
          hasText: "Cash on Delivery",
        })
        .first();

      await expect(cod).toBeVisible({
        timeout: 10000,
      });

      await cod.click();

      // 7. Place order
      const placeOrder = page.getByRole("button", {
        name: /place order/i,
      });

      await expect(placeOrder).toBeVisible();

      await placeOrder.click();

      // Checkout.jsx redirects here after POST /orders.
      await expect(page).toHaveURL(
        /\/app\/orders/,
        {
          timeout: 15000,
        }
      );

      // 8. Verify order page
      await expect(
        page.getByRole("heading", {
          name: /my orders/i,
        })
      ).toBeVisible({
        timeout: 15000,
      });

      await expect(
        page.getByText(/payment:\s*cod/i).first()
      ).toBeVisible({
        timeout: 15000,
      });
    }
  );


  // ============================================================
  // E2E-2
  // Login → Search → Product → Cart
  // ============================================================

  test(
    "E2E-2: product search and cart workflow",
    async ({ page }) => {

      // 1. Authentication
      await loginAsCustomer(page);

      // 2. Search → Product → Cart
      await addProductToCart(page);

      // 3. Verify cart
      await expect(
        page.getByRole("heading", {
          name: /shopping cart/i,
        })
      ).toBeVisible();

      await expect(
        page.getByText("Order Summary", {
          exact: true,
        })
      ).toBeVisible();

      await expect(
        page.getByRole("button", {
          name: /proceed to checkout/i,
        })
      ).toBeVisible();
    }
  );


  // ============================================================
  // E2E-3
  // Login → Logout → Protected Route
  // ============================================================

  test(
    "E2E-3: logout protects authenticated routes",
    async ({ page }) => {

      // 1. Login
      await loginAsCustomer(page);

      // 2. Logout
      const logout = page.getByRole("button", {
        name: /logout|sign out/i,
      });

      await expect(logout).toBeVisible({
        timeout: 10000,
      });

      await logout.click();

      await expect(page).toHaveURL(
        /\/login/,
        {
          timeout: 10000,
        }
      );

      // 3. Protected route must redirect
      await page.goto("/app/orders", {
        waitUntil: "domcontentloaded",
      });

      await expect(page).toHaveURL(
        /\/login/,
        {
          timeout: 10000,
        }
      );
    }
  );

});
