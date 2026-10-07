# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 01-auth.spec.ts >> Authentication - Customer Login >> AUTH-11: password visibility toggle works
- Location: e2e\01-auth.spec.ts:153:3

# Error details

```
Error: expect(locator).toHaveAttribute(expected) failed

Locator:  getByLabel('Password')
Expected: "text"
Received: "password"
Timeout:  5000ms

Call log:
  - Expect "toHaveAttribute" getByLabel('Password') with timeout 5000ms
  - waiting for getByLabel('Password')
    13 × locator resolved to <input type="password" value="Demo@123" class="mt-1 w-full rounded-xl border p-3 pr-11 outline-none focus:border-indigo-500"/>
       - unexpected value "password"

```

```yaml
- textbox "Password": Demo@123
```

# Test source

```ts
  66  |   });
  67  | 
  68  |   test("AUTH-05: unknown email is rejected", async ({ page }) => {
  69  |     await page.getByLabel("Email").fill("unknown-user@shopflow.com");
  70  |     await page.getByLabel("Password").fill("Demo@123");
  71  | 
  72  |     await page.getByText("Customer", { exact: true }).click();
  73  |     await page.getByRole("button", { name: /sign in/i }).click();
  74  | 
  75  |     await expect(page).toHaveURL(/\/login/);
  76  | 
  77  |     await expect(
  78  |       page.getByText(/invalid email or password/i)
  79  |     ).toBeVisible();
  80  |   });
  81  | 
  82  |   test("AUTH-06: empty email does not authenticate", async ({ page }) => {
  83  |     await page.getByLabel("Email").fill("");
  84  |     await page.getByLabel("Password").fill(CUSTOMER_PASSWORD);
  85  | 
  86  |     await page.getByText("Customer", { exact: true }).click();
  87  |     await page.getByRole("button", { name: /sign in/i }).click();
  88  | 
  89  |     await expect(page).toHaveURL(/\/login/);
  90  |     await expect(page).not.toHaveURL(/\/app/);
  91  |   });
  92  | 
  93  |   test("AUTH-07: empty password is rejected", async ({ page }) => {
  94  |     await page.getByLabel("Email").fill(CUSTOMER_EMAIL);
  95  |     await page.getByLabel("Password").fill("");
  96  | 
  97  |     await page.getByRole("button", { name: /sign in/i }).click();
  98  | 
  99  |     await expect(page).toHaveURL(/\/login/);
  100 | 
  101 |     await expect(
  102 |       page.locator(".bg-red-50")
  103 |     ).toBeVisible();
  104 |   });
  105 | 
  106 |   test("AUTH-08: empty email and password do not authenticate", async ({
  107 |     page,
  108 |   }) => {
  109 |     await page.getByLabel("Email").fill("");
  110 |     await page.getByLabel("Password").fill("");
  111 | 
  112 |     await page.getByText("Customer", { exact: true }).click();
  113 |     await page.getByRole("button", { name: /sign in/i }).click();
  114 | 
  115 |     await expect(page).toHaveURL(/\/login/);
  116 |     await expect(page).not.toHaveURL(/\/app/);
  117 |   });
  118 | 
  119 |   test("AUTH-09: customer credentials cannot login as admin", async ({
  120 |     page,
  121 |   }) => {
  122 |     await page.getByLabel("Email").fill(CUSTOMER_EMAIL);
  123 |     await page.getByLabel("Password").fill(CUSTOMER_PASSWORD);
  124 | 
  125 |     await page.getByText("Admin", { exact: true }).click();
  126 | 
  127 |     await page.getByRole("button", { name: /sign in/i }).click();
  128 | 
  129 |     await expect(page).toHaveURL(/\/login/);
  130 | 
  131 |     await expect(
  132 |       page.getByText(/selected role does not match account/i)
  133 |     ).toBeVisible();
  134 |   });
  135 | 
  136 |   test("AUTH-10: admin credentials cannot login as customer", async ({
  137 |     page,
  138 |   }) => {
  139 |     await page.getByLabel("Email").fill(ADMIN_EMAIL);
  140 |     await page.getByLabel("Password").fill(ADMIN_PASSWORD);
  141 | 
  142 |     await page.getByText("Customer", { exact: true }).click();
  143 | 
  144 |     await page.getByRole("button", { name: /sign in/i }).click();
  145 | 
  146 |     await expect(page).toHaveURL(/\/login/);
  147 | 
  148 |     await expect(
  149 |       page.getByText(/selected role does not match account/i)
  150 |     ).toBeVisible();
  151 |   });
  152 | 
  153 |   test("AUTH-11: password visibility toggle works", async ({ page }) => {
  154 |     const password = page.getByLabel("Password");
  155 | 
  156 |     await password.fill(CUSTOMER_PASSWORD);
  157 | 
  158 |     await expect(password).toHaveAttribute("type", "password");
  159 | 
  160 |     const toggle = page.locator('button[type="button"]').filter({
  161 |       has: page.locator("svg"),
  162 |     }).first();
  163 | 
  164 |     await toggle.click();
  165 | 
> 166 |     await expect(password).toHaveAttribute("type", "text");
      |                            ^ Error: expect(locator).toHaveAttribute(expected) failed
  167 |   });
  168 | 
  169 |   test("AUTH-12: customer can navigate to registration page", async ({
  170 |     page,
  171 |   }) => {
  172 |     await page.getByRole("link", { name: /create account/i }).click();
  173 | 
  174 |     await expect(page).toHaveURL(/\/register/);
  175 | 
  176 |     await expect(
  177 |       page.getByRole("heading", { name: /create your account/i })
  178 |     ).toBeVisible();
  179 |   });
  180 | });
  181 | 
  182 | 
  183 | test.describe("Authentication - Registration Form", () => {
  184 |   test.beforeEach(async ({ page }) => {
  185 |     await page.goto("/register");
  186 |   });
  187 | 
  188 |   test("AUTH-13: registration form renders correctly", async ({ page }) => {
  189 |     await expect(
  190 |       page.getByRole("heading", { name: /create your account/i })
  191 |     ).toBeVisible();
  192 | 
  193 |     await expect(page.getByLabel("Full name")).toBeVisible();
  194 |     await expect(page.getByLabel("Email")).toBeVisible();
  195 |     await expect(page.getByLabel("Password")).toBeVisible();
  196 | 
  197 |     await expect(
  198 |       page.getByRole("button", { name: /create account/i })
  199 |     ).toBeVisible();
  200 |   });
  201 | 
  202 |   test("AUTH-14: required validation prevents empty registration", async ({
  203 |     page,
  204 |   }) => {
  205 |     await page.getByRole("button", { name: /create account/i }).click();
  206 | 
  207 |     await expect(page).toHaveURL(/\/register/);
  208 | 
  209 |     await expect(page.getByLabel("Full name")).toBeFocused();
  210 |   });
  211 | 
  212 |   test("AUTH-15: existing users can navigate back to login", async ({
  213 |     page,
  214 |   }) => {
  215 |     await page.getByRole("link", { name: /sign in/i }).click();
  216 | 
  217 |     await expect(page).toHaveURL(/\/login/);
  218 | 
  219 |     await expect(
  220 |       page.getByRole("heading", { name: /welcome back/i })
  221 |     ).toBeVisible();
  222 |   });
  223 | });
  224 | 
```