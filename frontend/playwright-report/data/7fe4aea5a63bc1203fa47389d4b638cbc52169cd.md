# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 08-admin-products.spec.ts >> Admin Product Management E2E >> ADMIN-PRODUCT-07 - Create Product form renders
- Location: e2e\08-admin-products.spec.ts:194:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: /shopflow admin command center/i })
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByRole('heading', { name: /shopflow admin command center/i }) with timeout 10000ms
  - waiting for getByRole('heading', { name: /shopflow admin command center/i })

```

```yaml
- button "Notifications":
  - img
- button "Support Inbox":
  - img
  - text: Support Inbox
- text: shopflow
- img
- heading "Everything you need. One smart shopping flow." [level=1]
- paragraph: A complete e-commerce experience with discovery, offers, wishlist, secure checkout and live order operations.
- paragraph: Day 10–17 Engineering Project
- heading "Welcome back" [level=2]
- paragraph: Sign in to continue to ShopFlow.
- text: Email
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

```
Tearing down "context" exceeded the test timeout of 30000ms.
```