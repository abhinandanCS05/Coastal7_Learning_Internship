# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 07-admin-auth.spec.ts >> Admin Authentication & Authorization E2E >> ADMIN-AUTH-02 - Valid admin credentials login successfully
- Location: e2e\07-admin-auth.spec.ts:70:3

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /\/app$/
Received string:  "http://127.0.0.1:5173/app/admin"
Timeout: 5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    10 × locator resolved to <html>…</html>
       - unexpected value "http://127.0.0.1:5173/app/admin"

```

```yaml
- button "Notifications":
  - img
- button "Support Inbox":
  - img
  - text: Support Inbox
- banner:
  - link "shopflow":
    - /url: /app/admin
  - img
  - paragraph: Administration
  - paragraph: Admin Command Center
  - button "Toggle theme":
    - img
  - img
  - text: ShopFlow Admin
  - button "Logout":
    - img
  - link "Command Center":
    - /url: /app/admin
    - img
    - text: Command Center
- main:
  - main:
    - paragraph: Operations / Administration
    - heading "ShopFlow Admin Command Center" [level=1]
    - paragraph: Manage customer orders, catalogue data, pricing, stock, product information and media from one protected administration workspace.
    - button "Refresh":
      - img
      - text: Refresh
    - img
    - paragraph: "31"
    - paragraph: Order Placed
    - img
    - paragraph: "1"
    - paragraph: Processing
    - img
    - paragraph: "1"
    - paragraph: Shipped
    - img
    - paragraph: "3"
    - paragraph: Delivered
    - img
    - paragraph: "1"
    - paragraph: Cancelled
    - heading "Live Order Command Center" [level=2]
    - paragraph: New customer orders appear here automatically. Only administrators can change order status.
    - article:
      - text: "#37"
      - heading "Demo Customer" [level=3]
      - paragraph: "demo@shopflow.com ? Customer ID #2 ? 10/8/2026, 8:57:46 AM"
      - text: DELIVERED
      - heading "Products" [level=4]:
        - img
        - text: Products
      - text: Nova X Pro 5G ? 1 1,499 Subtotal1,499 ? Discount149.9 ? Shipping0 Total 1,349.1
      - heading "Customer & Delivery" [level=4]:
        - img
        - text: Customer & Delivery
      - paragraph: Demo Customer
      - paragraph: demo@shopflow.com
      - paragraph: "9876543210"
      - img
      - text: 123 ShopFlow Street, Guntur, Andhra Pradesh - 522001
      - heading "Payment & Status" [level=4]:
        - img
        - text: Payment & Status
      - paragraph: "Method: COD"
      - paragraph: "Payment: PAID"
    - article:
      - text: "#36"
      - heading "Demo Customer" [level=3]
      - paragraph: "demo@shopflow.com ? Customer ID #2 ? 10/7/2026, 1:20:38 PM"
      - text: PLACED
      - heading "Products" [level=4]:
        - img
        - text: Products
      - text: Nova X Pro 5G ? 1 1,499 Subtotal1,499 ? Discount149.9 ? Shipping0 Total 1,349.1
      - heading "Customer & Delivery" [level=4]:
        - img
        - text: Customer & Delivery
      - paragraph: Demo Customer
      - paragraph: demo@shopflow.com
      - paragraph: "9876543210"
      - img
      - text: 123 ShopFlow Street, Guntur, Andhra Pradesh - 522001
      - heading "Payment & Status" [level=4]:
        - img
        - text: Payment & Status
      - paragraph: "Method: COD"
      - paragraph: "Payment: PAY_ON_DELIVERY"
      - button "Move to PROCESSING"
      - button "Cancel Order"
    - article:
      - text: "#35"
      - heading "Demo Customer" [level=3]
      - paragraph: "demo@shopflow.com ? Customer ID #2 ? 10/7/2026, 1:14:58 PM"
      - text: PLACED
      - heading "Products" [level=4]:
        - img
        - text: Products
      - text: Nova X Pro 5G ? 1 1,499 Subtotal1,499 ? Discount149.9 ? Shipping0 Total 1,349.1
      - heading "Customer & Delivery" [level=4]:
        - img
        - text: Customer & Delivery
      - paragraph: Demo Customer
      - paragraph: demo@shopflow.com
      - paragraph: "9876543210"
      - img
      - text: 123 Main Street, Guntur, Andhra Pradesh - 522001
      - heading "Payment & Status" [level=4]:
        - img
        - text: Payment & Status
      - paragraph: "Method: COD"
      - paragraph: "Payment: PAY_ON_DELIVERY"
      - button "Move to PROCESSING"
      - button "Cancel Order"
    - article:
      - text: "#34"
      - heading "Demo Customer" [level=3]
      - paragraph: "demo@shopflow.com ? Customer ID #2 ? 10/7/2026, 12:57:19 PM"
      - text: PLACED
      - heading "Products" [level=4]:
        - img
        - text: Products
      - text: Nova X Pro 5G ? 1 1,499 Subtotal1,499 ? Discount149.9 ? Shipping0 Total 1,349.1
      - heading "Customer & Delivery" [level=4]:
        - img
        - text: Customer & Delivery
      - paragraph: Demo Customer
      - paragraph: demo@shopflow.com
      - paragraph: "9876543210"
      - img
      - text: 123 ShopFlow Street, Guntur, Andhra Pradesh - 522001
      - heading "Payment & Status" [level=4]:
        - img
        - text: Payment & Status
      - paragraph: "Method: COD"
      - paragraph: "Payment: PAY_ON_DELIVERY"
      - button "Move to PROCESSING"
      - button "Cancel Order"
    - article:
      - text: "#33"
      - heading "Demo Customer" [level=3]
      - paragraph: "demo@shopflow.com ? Customer ID #2 ? 10/7/2026, 12:30:50 PM"
      - text: PLACED
      - heading "Products" [level=4]:
        - img
        - text: Products
      - text: Nova X Pro 5G ? 1 1,499 Subtotal1,499 ? Discount149.9 ? Shipping0 Total 1,349.1
      - heading "Customer & Delivery" [level=4]:
        - img
        - text: Customer & Delivery
      - paragraph: Demo Customer
      - paragraph: demo@shopflow.com
      - paragraph: "9876543210"
      - img
      - text: 123 ShopFlow Street, Guntur, Andhra Pradesh - 522001
      - heading "Payment & Status" [level=4]:
        - img
        - text: Payment & Status
      - paragraph: "Method: COD"
      - paragraph: "Payment: PAY_ON_DELIVERY"
      - button "Move to PROCESSING"
      - button "Cancel Order"
    - article:
      - text: "#32"
      - heading "Demo Customer" [level=3]
      - paragraph: "demo@shopflow.com ? Customer ID #2 ? 10/7/2026, 12:25:24 PM"
      - text: PLACED
      - heading "Products" [level=4]:
        - img
        - text: Products
      - text: Nova X Pro 5G ? 1 1,499 Subtotal1,499 ? Discount149.9 ? Shipping0 Total 1,349.1
      - heading "Customer & Delivery" [level=4]:
        - img
        - text: Customer & Delivery
      - paragraph: Demo Customer
      - paragraph: demo@shopflow.com
      - paragraph: "9876543210"
      - img
      - text: 123 Main Street, Guntur, Andhra Pradesh - 522001
      - heading "Payment & Status" [level=4]:
        - img
        - text: Payment & Status
      - paragraph: "Method: COD"
      - paragraph: "Payment: PAY_ON_DELIVERY"
      - button "Move to PROCESSING"
      - button "Cancel Order"
    - article:
      - text: "#31"
      - heading "Demo Customer" [level=3]
      - paragraph: "demo@shopflow.com ? Customer ID #2 ? 10/7/2026, 12:14:36 PM"
      - text: PLACED
      - heading "Products" [level=4]:
        - img
        - text: Products
      - text: Nova X Pro 5G ? 1 1,499 Subtotal1,499 ? Discount149.9 ? Shipping0 Total 1,349.1
      - heading "Customer & Delivery" [level=4]:
        - img
        - text: Customer & Delivery
      - paragraph: Demo Customer
      - paragraph: demo@shopflow.com
      - paragraph: "9876543210"
      - img
      - text: 123 ShopFlow Street, Guntur, Andhra Pradesh - 522001
      - heading "Payment & Status" [level=4]:
        - img
        - text: Payment & Status
      - paragraph: "Method: COD"
      - paragraph: "Payment: PAY_ON_DELIVERY"
      - button "Move to PROCESSING"
      - button "Cancel Order"
    - article:
      - text: "#30"
      - heading "Demo Customer" [level=3]
      - paragraph: "demo@shopflow.com ? Customer ID #2 ? 10/7/2026, 12:06:06 PM"
      - text: PLACED
      - heading "Products" [level=4]:
        - img
        - text: Products
      - text: Nova X Pro 5G ? 1 1,499 Subtotal1,499 ? Discount149.9 ? Shipping0 Total 1,349.1
      - heading "Customer & Delivery" [level=4]:
        - img
        - text: Customer & Delivery
      - paragraph: Demo Customer
      - paragraph: demo@shopflow.com
      - paragraph: "9876543210"
      - img
      - text: 123 Main Street, Guntur, Andhra Pradesh - 522001
      - heading "Payment & Status" [level=4]:
        - img
        - text: Payment & Status
      - paragraph: "Method: COD"
      - paragraph: "Payment: PAY_ON_DELIVERY"
      - button "Move to PROCESSING"
      - button "Cancel Order"
    - article:
      - text: "#29"
      - heading "Demo Customer" [level=3]
      - paragraph: "demo@shopflow.com ? Customer ID #2 ? 10/7/2026, 12:05:25 PM"
      - text: PLACED
      - heading "Products" [level=4]:
        - img
        - text: Products
      - text: Nova X Pro 5G ? 1 1,499 PixelEdge 9 ? 1 999 Subtotal2,498 ? Discount249.8 ? Shipping0 Total 2,248.2
      - heading "Customer & Delivery" [level=4]:
        - img
        - text: Customer & Delivery
      - paragraph: Demo Customer
      - paragraph: demo@shopflow.com
      - paragraph: "9876543210"
      - img
      - text: 123 ShopFlow Street, Guntur, Andhra Pradesh - 522001
      - heading "Payment & Status" [level=4]:
        - img
        - text: Payment & Status
      - paragraph: "Method: COD"
      - paragraph: "Payment: PAY_ON_DELIVERY"
      - button "Move to PROCESSING"
      - button "Cancel Order"
    - article:
      - text: "#28"
      - heading "Demo Customer" [level=3]
      - paragraph: "demo@shopflow.com ? Customer ID #2 ? 10/7/2026, 10:42:20 AM"
      - text: PLACED
      - heading "Products" [level=4]:
        - img
        - text: Products
      - text: Nova X Pro 5G ? 1 1,499 PixelEdge 9 ? 1 999 Subtotal2,498 ? Discount249.8 ? Shipping0 Total 2,248.2
      - heading "Customer & Delivery" [level=4]:
        - img
        - text: Customer & Delivery
      - paragraph: Demo Customer
      - paragraph: demo@shopflow.com
      - paragraph: "9876543210"
      - img
      - text: 123 ShopFlow Street, Guntur, Andhra Pradesh - 522001
      - heading "Payment & Status" [level=4]:
        - img
        - text: Payment & Status
      - paragraph: "Method: COD"
      - paragraph: "Payment: PAY_ON_DELIVERY"
      - button "Move to PROCESSING"
      - button "Cancel Order"
    - article:
      - text: "#27"
      - heading "Demo Customer" [level=3]
      - paragraph: "demo@shopflow.com ? Customer ID #2 ? 10/7/2026, 9:44:00 AM"
      - text: PLACED
      - heading "Products" [level=4]:
        - img
        - text: Products
      - text: Nova X Pro 5G ? 1 1,499 Subtotal1,499 ? Discount149.9 ? Shipping0 Total 1,349.1
      - heading "Customer & Delivery" [level=4]:
        - img
        - text: Customer & Delivery
      - paragraph: Demo Customer
      - paragraph: demo@shopflow.com
      - paragraph: "9876543210"
      - img
      - text: 123 ShopFlow Street, Guntur, Andhra Pradesh - 522001
      - heading "Payment & Status" [level=4]:
        - img
        - text: Payment & Status
      - paragraph: "Method: COD"
      - paragraph: "Payment: PAY_ON_DELIVERY"
      - button "Move to PROCESSING"
      - button "Cancel Order"
    - article:
      - text: "#26"
      - heading "Demo Customer" [level=3]
      - paragraph: "demo@shopflow.com ? Customer ID #2 ? 10/7/2026, 9:39:58 AM"
      - text: PLACED
      - heading "Products" [level=4]:
        - img
        - text: Products
      - text: Nova X Pro 5G ? 1 1,499 PixelEdge 9 ? 1 999 Subtotal2,498 ? Discount249.8 ? Shipping0 Total 2,248.2
      - heading "Customer & Delivery" [level=4]:
        - img
        - text: Customer & Delivery
      - paragraph: Demo Customer
      - paragraph: demo@shopflow.com
      - paragraph: "9876543210"
      - img
      - text: 123 Main Street, Guntur, Andhra Pradesh - 522001
      - heading "Payment & Status" [level=4]:
        - img
        - text: Payment & Status
      - paragraph: "Method: COD"
      - paragraph: "Payment: PAY_ON_DELIVERY"
      - button "Move to PROCESSING"
      - button "Cancel Order"
    - article:
      - text: "#25"
      - heading "Demo Customer" [level=3]
      - paragraph: "demo@shopflow.com ? Customer ID #2 ? 10/7/2026, 9:25:08 AM"
      - text: PLACED
      - heading "Products" [level=4]:
        - img
        - text: Products
      - text: Nova X Pro 5G ? 1 1,499 Subtotal1,499 ? Discount149.9 ? Shipping0 Total 1,349.1
      - heading "Customer & Delivery" [level=4]:
        - img
        - text: Customer & Delivery
      - paragraph: Demo Customer
      - paragraph: demo@shopflow.com
      - paragraph: "9876543210"
      - img
      - text: 123 ShopFlow Street, Guntur, Andhra Pradesh - 522001
      - heading "Payment & Status" [level=4]:
        - img
        - text: Payment & Status
      - paragraph: "Method: COD"
      - paragraph: "Payment: PAY_ON_DELIVERY"
      - button "Move to PROCESSING"
      - button "Cancel Order"
    - article:
      - text: "#24"
      - heading "Demo Customer" [level=3]
      - paragraph: "demo@shopflow.com ? Customer ID #2 ? 10/7/2026, 9:20:40 AM"
      - text: PLACED
      - heading "Products" [level=4]:
        - img
        - text: Products
      - text: Nova X Pro 5G ? 1 1,499 PixelEdge 9 ? 1 999 Subtotal2,498 ? Discount249.8 ? Shipping0 Total 2,248.2
      - heading "Customer & Delivery" [level=4]:
        - img
        - text: Customer & Delivery
      - paragraph: Demo Customer
      - paragraph: demo@shopflow.com
      - paragraph: "9876543210"
      - img
      - text: 123 Main Street, Guntur, Andhra Pradesh - 522001
      - heading "Payment & Status" [level=4]:
        - img
        - text: Payment & Status
      - paragraph: "Method: COD"
      - paragraph: "Payment: PAY_ON_DELIVERY"
      - button "Move to PROCESSING"
      - button "Cancel Order"
    - article:
      - text: "#23"
      - heading "Demo Customer" [level=3]
      - paragraph: "demo@shopflow.com ? Customer ID #2 ? 10/7/2026, 9:06:58 AM"
      - text: PLACED
      - heading "Products" [level=4]:
        - img
        - text: Products
      - text: Nova X Pro 5G ? 1 1,499 Subtotal1,499 ? Discount149.9 ? Shipping0 Total 1,349.1
      - heading "Customer & Delivery" [level=4]:
        - img
        - text: Customer & Delivery
      - paragraph: Demo Customer
      - paragraph: demo@shopflow.com
      - paragraph: "9876543210"
      - img
      - text: 123 ShopFlow Street, Guntur, Andhra Pradesh - 522001
      - heading "Payment & Status" [level=4]:
        - img
        - text: Payment & Status
      - paragraph: "Method: COD"
      - paragraph: "Payment: PAY_ON_DELIVERY"
      - button "Move to PROCESSING"
      - button "Cancel Order"
    - article:
      - text: "#22"
      - heading "Demo Customer" [level=3]
      - paragraph: "demo@shopflow.com ? Customer ID #2 ? 10/7/2026, 9:02:32 AM"
      - text: PLACED
      - heading "Products" [level=4]:
        - img
        - text: Products
      - text: Nova X Pro 5G ? 1 1,499 PixelEdge 9 ? 1 999 Subtotal2,498 ? Discount249.8 ? Shipping0 Total 2,248.2
      - heading "Customer & Delivery" [level=4]:
        - img
        - text: Customer & Delivery
      - paragraph: Demo Customer
      - paragraph: demo@shopflow.com
      - paragraph: "9876543210"
      - img
      - text: 123 Main Street, Guntur, Andhra Pradesh - 522001
      - heading "Payment & Status" [level=4]:
        - img
        - text: Payment & Status
      - paragraph: "Method: COD"
      - paragraph: "Payment: PAY_ON_DELIVERY"
      - button "Move to PROCESSING"
      - button "Cancel Order"
    - article:
      - text: "#21"
      - heading "Demo Customer" [level=3]
      - paragraph: "demo@shopflow.com ? Customer ID #2 ? 10/7/2026, 7:25:12 AM"
      - text: PLACED
      - heading "Products" [level=4]:
        - img
        - text: Products
      - text: PixelEdge 9 ? 1 999 Nova X Pro 5G ? 1 1,499 Subtotal2,498 ? Discount249.8 ? Shipping0 Total 2,248.2
      - heading "Customer & Delivery" [level=4]:
        - img
        - text: Customer & Delivery
      - paragraph: Demo Customer
      - paragraph: demo@shopflow.com
      - paragraph: "9876543210"
      - img
      - text: 123 Main Street, Guntur, Andhra Pradesh - 522001
      - heading "Payment & Status" [level=4]:
        - img
        - text: Payment & Status
      - paragraph: "Method: COD"
      - paragraph: "Payment: PAY_ON_DELIVERY"
      - button "Move to PROCESSING"
      - button "Cancel Order"
    - article:
      - text: "#20"
      - heading "Demo Customer" [level=3]
      - paragraph: "demo@shopflow.com ? Customer ID #2 ? 10/6/2026, 12:56:00 PM"
      - text: PLACED
      - heading "Products" [level=4]:
        - img
        - text: Products
      - text: AeroPhone 12 ? 1 19,999 Subtotal19,999 ? Discount500 ? Shipping0 Total 19,499
      - heading "Customer & Delivery" [level=4]:
        - img
        - text: Customer & Delivery
      - paragraph: Demo Customer
      - paragraph: demo@shopflow.com
      - paragraph: "9876543210"
      - img
      - text: 123 ShopFlow Street, Guntur, Andhra Pradesh - 522001
      - heading "Payment & Status" [level=4]:
        - img
        - text: Payment & Status
      - paragraph: "Method: COD"
      - paragraph: "Payment: PAY_ON_DELIVERY"
      - button "Move to PROCESSING"
      - button "Cancel Order"
    - article:
      - text: "#19"
      - heading "Demo Customer" [level=3]
      - paragraph: "demo@shopflow.com ? Customer ID #2 ? 10/6/2026, 11:45:59 AM"
      - text: DELIVERED
      - heading "Products" [level=4]:
        - img
        - text: Products
      - text: PixelEdge 9 ? 1 999 Subtotal999 ? Discount99.9 ? Shipping0 Total 899.1
      - heading "Customer & Delivery" [level=4]:
        - img
        - text: Customer & Delivery
      - paragraph: Demo Customer
      - paragraph: demo@shopflow.com
      - paragraph: "9876543210"
      - img
      - text: 123 ShopFlow Street, Guntur, Andhra Pradesh - 522001
      - heading "Payment & Status" [level=4]:
        - img
        - text: Payment & Status
      - paragraph: "Method: COD"
      - paragraph: "Payment: PAID"
    - article:
      - text: "#18"
      - heading "Demo Customer" [level=3]
      - paragraph: "demo@shopflow.com ? Customer ID #2 ? 10/6/2026, 6:47:02 AM"
      - text: PLACED
      - heading "Products" [level=4]:
        - img
        - text: Products
      - text: Nova X Pro 5G ? 1 1,499 Subtotal1,499 ? Discount149.9 ? Shipping0 Total 1,349.1
      - heading "Customer & Delivery" [level=4]:
        - img
        - text: Customer & Delivery
      - paragraph: Demo Customer
      - paragraph: demo@shopflow.com
      - paragraph: "9876543210"
      - img
      - text: 123 ShopFlow Street, Guntur, Andhra Pradesh - 522001
      - heading "Payment & Status" [level=4]:
        - img
        - text: Payment & Status
      - paragraph: "Method: COD"
      - paragraph: "Payment: PAY_ON_DELIVERY"
      - button "Move to PROCESSING"
      - button "Cancel Order"
    - article:
      - text: "#17"
      - heading "Demo Customer" [level=3]
      - paragraph: "demo@shopflow.com ? Customer ID #2 ? 10/6/2026, 5:09:07 AM"
      - text: PLACED
      - heading "Products" [level=4]:
        - img
        - text: Products
      - text: Nova X Pro 5G ? 1 1,499 Subtotal1,499 ? Discount149.9 ? Shipping0 Total 1,349.1
      - heading "Customer & Delivery" [level=4]:
        - img
        - text: Customer & Delivery
      - paragraph: Demo Customer
      - paragraph: demo@shopflow.com
      - paragraph: "9876543210"
      - img
      - text: 123 ShopFlow Street, Guntur, Andhra Pradesh - 522001
      - heading "Payment & Status" [level=4]:
        - img
        - text: Payment & Status
      - paragraph: "Method: COD"
      - paragraph: "Payment: PAY_ON_DELIVERY"
      - button "Move to PROCESSING"
      - button "Cancel Order"
    - article:
      - text: "#16"
      - heading "Demo Customer" [level=3]
      - paragraph: "demo@shopflow.com ? Customer ID #2 ? 10/6/2026, 5:04:01 AM"
      - text: PLACED
      - heading "Products" [level=4]:
        - img
        - text: Products
      - text: Nova X Pro 5G ? 1 1,499 Subtotal1,499 ? Discount149.9 ? Shipping0 Total 1,349.1
      - heading "Customer & Delivery" [level=4]:
        - img
        - text: Customer & Delivery
      - paragraph: Demo Customer
      - paragraph: demo@shopflow.com
      - paragraph: "9876543210"
      - img
      - text: 123 ShopFlow Street, Guntur, Andhra Pradesh - 522001
      - heading "Payment & Status" [level=4]:
        - img
        - text: Payment & Status
      - paragraph: "Method: COD"
      - paragraph: "Payment: PAY_ON_DELIVERY"
      - button "Move to PROCESSING"
      - button "Cancel Order"
    - article:
      - text: "#15"
      - heading "Demo Customer" [level=3]
      - paragraph: "demo@shopflow.com ? Customer ID #2 ? 10/5/2026, 6:44:28 PM"
      - text: PLACED
      - heading "Products" [level=4]:
        - img
        - text: Products
      - text: Nova X Pro 5G ? 1 1,499 Subtotal1,499 ? Discount149.9 ? Shipping0 Total 1,349.1
      - heading "Customer & Delivery" [level=4]:
        - img
        - text: Customer & Delivery
      - paragraph: Demo Customer
      - paragraph: demo@shopflow.com
      - paragraph: "9876543210"
      - img
      - text: 123 ShopFlow Street, Guntur, Andhra Pradesh - 522001
      - heading "Payment & Status" [level=4]:
        - img
        - text: Payment & Status
      - paragraph: "Method: COD"
      - paragraph: "Payment: PAY_ON_DELIVERY"
      - button "Move to PROCESSING"
      - button "Cancel Order"
    - article:
      - text: "#14"
      - heading "Demo Customer" [level=3]
      - paragraph: "demo@shopflow.com ? Customer ID #2 ? 10/5/2026, 6:43:48 PM"
      - text: PLACED
      - heading "Products" [level=4]:
        - img
        - text: Products
      - text: Nova X Pro 5G ? 1 1,499 Subtotal1,499 ? Discount149.9 ? Shipping0 Total 1,349.1
      - heading "Customer & Delivery" [level=4]:
        - img
        - text: Customer & Delivery
      - paragraph: Demo Customer
      - paragraph: demo@shopflow.com
      - paragraph: "9876543210"
      - img
      - text: 123 ShopFlow Street, Guntur, Andhra Pradesh - 522001
      - heading "Payment & Status" [level=4]:
        - img
        - text: Payment & Status
      - paragraph: "Method: COD"
      - paragraph: "Payment: PAY_ON_DELIVERY"
      - button "Move to PROCESSING"
      - button "Cancel Order"
    - article:
      - text: "#13"
      - heading "Demo Customer" [level=3]
      - paragraph: "demo@shopflow.com ? Customer ID #2 ? 10/5/2026, 6:39:27 PM"
      - text: PLACED
      - heading "Products" [level=4]:
        - img
        - text: Products
      - text: Nova X Pro 5G ? 1 1,499 Subtotal1,499 ? Discount149.9 ? Shipping0 Total 1,349.1
      - heading "Customer & Delivery" [level=4]:
        - img
        - text: Customer & Delivery
      - paragraph: Demo Customer
      - paragraph: demo@shopflow.com
      - paragraph: "9876543210"
      - img
      - text: 123 ShopFlow Street, Guntur, Andhra Pradesh - 522001
      - heading "Payment & Status" [level=4]:
        - img
        - text: Payment & Status
      - paragraph: "Method: COD"
      - paragraph: "Payment: PAY_ON_DELIVERY"
      - button "Move to PROCESSING"
      - button "Cancel Order"
    - article:
      - text: "#12"
      - heading "Demo Customer" [level=3]
      - paragraph: "demo@shopflow.com ? Customer ID #2 ? 10/5/2026, 6:35:35 PM"
      - text: PLACED
      - heading "Products" [level=4]:
        - img
        - text: Products
      - text: Nova X Pro 5G ? 1 1,499 Subtotal1,499 ? Discount149.9 ? Shipping0 Total 1,349.1
      - heading "Customer & Delivery" [level=4]:
        - img
        - text: Customer & Delivery
      - paragraph: Demo Customer
      - paragraph: demo@shopflow.com
      - paragraph: "9876543210"
      - img
      - text: 123 ShopFlow Street, Guntur, Andhra Pradesh - 522001
      - heading "Payment & Status" [level=4]:
        - img
        - text: Payment & Status
      - paragraph: "Method: COD"
      - paragraph: "Payment: PAY_ON_DELIVERY"
      - button "Move to PROCESSING"
      - button "Cancel Order"
    - article:
      - text: "#11"
      - heading "Demo Customer" [level=3]
      - paragraph: "demo@shopflow.com ? Customer ID #2 ? 10/5/2026, 4:49:21 PM"
      - text: PLACED
      - heading "Products" [level=4]:
        - img
        - text: Products
      - text: Nova X Pro 5G ? 1 1,499 Subtotal1,499 ? Discount149.9 ? Shipping0 Total 1,349.1
      - heading "Customer & Delivery" [level=4]:
        - img
        - text: Customer & Delivery
      - paragraph: Demo Customer
      - paragraph: demo@shopflow.com
      - paragraph: "9876543210"
      - img
      - text: 123 ShopFlow Street, Guntur, Andhra Pradesh - 522001
      - heading "Payment & Status" [level=4]:
        - img
        - text: Payment & Status
      - paragraph: "Method: COD"
      - paragraph: "Payment: PAY_ON_DELIVERY"
      - button "Move to PROCESSING"
      - button "Cancel Order"
    - article:
      - text: "#10"
      - heading "Demo Customer" [level=3]
      - paragraph: "demo@shopflow.com ? Customer ID #2 ? 10/5/2026, 4:47:57 PM"
      - text: PLACED
      - heading "Products" [level=4]:
        - img
        - text: Products
      - text: Nova X Pro 5G ? 1 1,499 Subtotal1,499 ? Discount149.9 ? Shipping0 Total 1,349.1
      - heading "Customer & Delivery" [level=4]:
        - img
        - text: Customer & Delivery
      - paragraph: Demo Customer
      - paragraph: demo@shopflow.com
      - paragraph: "9876543210"
      - img
      - text: 123 ShopFlow Street, Guntur, Andhra Pradesh - 522001
      - heading "Payment & Status" [level=4]:
        - img
        - text: Payment & Status
      - paragraph: "Method: COD"
      - paragraph: "Payment: PAY_ON_DELIVERY"
      - button "Move to PROCESSING"
      - button "Cancel Order"
    - article:
      - text: "#9"
      - heading "Demo Customer" [level=3]
      - paragraph: "demo@shopflow.com ? Customer ID #2 ? 10/5/2026, 4:44:05 PM"
      - text: PLACED
      - heading "Products" [level=4]:
        - img
        - text: Products
      - text: Nova X Pro 5G ? 1 1,499 Subtotal1,499 ? Discount149.9 ? Shipping0 Total 1,349.1
      - heading "Customer & Delivery" [level=4]:
        - img
        - text: Customer & Delivery
      - paragraph: Demo Customer
      - paragraph: demo@shopflow.com
      - paragraph: "9876543210"
      - img
      - text: 123 ShopFlow Street, Guntur, Andhra Pradesh - 522001
      - heading "Payment & Status" [level=4]:
        - img
        - text: Payment & Status
      - paragraph: "Method: COD"
      - paragraph: "Payment: PAY_ON_DELIVERY"
      - button "Move to PROCESSING"
      - button "Cancel Order"
    - article:
      - text: "#8"
      - heading "Demo Customer" [level=3]
      - paragraph: "demo@shopflow.com ? Customer ID #2 ? 10/5/2026, 4:43:13 PM"
      - text: PLACED
      - heading "Products" [level=4]:
        - img
        - text: Products
      - text: Nova X Pro 5G ? 1 1,499 Subtotal1,499 ? Discount149.9 ? Shipping0 Total 1,349.1
      - heading "Customer & Delivery" [level=4]:
        - img
        - text: Customer & Delivery
      - paragraph: Demo Customer
      - paragraph: demo@shopflow.com
      - paragraph: "9876543210"
      - img
      - text: 123 ShopFlow Street, Guntur, Andhra Pradesh - 522001
      - heading "Payment & Status" [level=4]:
        - img
        - text: Payment & Status
      - paragraph: "Method: COD"
      - paragraph: "Payment: PAY_ON_DELIVERY"
      - button "Move to PROCESSING"
      - button "Cancel Order"
    - article:
      - text: "#7"
      - heading "Demo Customer" [level=3]
      - paragraph: "demo@shopflow.com ? Customer ID #2 ? 10/5/2026, 4:41:24 PM"
      - text: PLACED
      - heading "Products" [level=4]:
        - img
        - text: Products
      - text: Nova X Pro 5G ? 1 1,499 Subtotal1,499 ? Discount149.9 ? Shipping0 Total 1,349.1
      - heading "Customer & Delivery" [level=4]:
        - img
        - text: Customer & Delivery
      - paragraph: Demo Customer
      - paragraph: demo@shopflow.com
      - paragraph: "9876543210"
      - img
      - text: 123 ShopFlow Street, Guntur, Andhra Pradesh - 522001
      - heading "Payment & Status" [level=4]:
        - img
        - text: Payment & Status
      - paragraph: "Method: COD"
      - paragraph: "Payment: PAY_ON_DELIVERY"
      - button "Move to PROCESSING"
      - button "Cancel Order"
    - article:
      - text: "#6"
      - heading "Demo Customer" [level=3]
      - paragraph: "demo@shopflow.com ? Customer ID #2 ? 10/5/2026, 4:39:15 PM"
      - text: PLACED
      - heading "Products" [level=4]:
        - img
        - text: Products
      - text: Nova X Pro 5G ? 1 1,499 Subtotal1,499 ? Discount149.9 ? Shipping0 Total 1,349.1
      - heading "Customer & Delivery" [level=4]:
        - img
        - text: Customer & Delivery
      - paragraph: Demo Customer
      - paragraph: demo@shopflow.com
      - paragraph: "9876543210"
      - img
      - text: 123 ShopFlow Street, Guntur, Andhra Pradesh - 522001
      - heading "Payment & Status" [level=4]:
        - img
        - text: Payment & Status
      - paragraph: "Method: COD"
      - paragraph: "Payment: PAY_ON_DELIVERY"
      - button "Move to PROCESSING"
      - button "Cancel Order"
    - article:
      - text: "#5"
      - heading "Demo Customer" [level=3]
      - paragraph: "demo@shopflow.com ? Customer ID #2 ? 10/5/2026, 12:40:05 PM"
      - text: PROCESSING
      - heading "Products" [level=4]:
        - img
        - text: Products
      - text: AeroPhone 12 ? 1 19,999 PixelEdge 9 ? 1 999 Subtotal20,998 ? Discount500 ? Shipping0 Total 20,498
      - heading "Customer & Delivery" [level=4]:
        - img
        - text: Customer & Delivery
      - paragraph: Demo Customer
      - paragraph: demo@shopflow.com
      - paragraph: "9876543210"
      - img
      - text: Sakthepuram 4th line, Naidupeta, Koritepadu, Guntur, Andhra Pradesh - 522007
      - heading "Payment & Status" [level=4]:
        - img
        - text: Payment & Status
      - paragraph: "Method: COD"
      - paragraph: "Payment: PAY_ON_DELIVERY"
      - button "Move to SHIPPED"
      - button "Cancel Order"
    - article:
      - text: "#4"
      - heading "Demo Customer" [level=3]
      - paragraph: "demo@shopflow.com ? Customer ID #2 ? 10/5/2026, 5:59:12 AM"
      - text: PLACED
      - heading "Products" [level=4]:
        - img
        - text: Products
      - text: PixelEdge 9 ? 1 999 Subtotal999 ? Discount99.9 ? Shipping0 Total 899.1
      - heading "Customer & Delivery" [level=4]:
        - img
        - text: Customer & Delivery
      - paragraph: Demo Customer
      - paragraph: demo@shopflow.com
      - paragraph: "9876543210"
      - img
      - text: Sakthepuram 4th line, Naidupeta, Koritepadu, Guntur, Andhra Pradesh - 522007
      - heading "Payment & Status" [level=4]:
        - img
        - text: Payment & Status
      - paragraph: "Method: COD"
      - paragraph: "Payment: PAY_ON_DELIVERY"
      - button "Move to PROCESSING"
      - button "Cancel Order"
    - article:
      - text: "#3"
      - heading "Demo Customer" [level=3]
      - paragraph: "demo@shopflow.com ? Customer ID #2 ? 10/1/2026, 4:57:43 AM"
      - text: SHIPPED
      - heading "Products" [level=4]:
        - img
        - text: Products
      - text: Nova X Pro 5G ? 1 1,499 Subtotal1,499 ? Discount149.9 ? Shipping0 Total 1,349.1
      - heading "Customer & Delivery" [level=4]:
        - img
        - text: Customer & Delivery
      - paragraph: Demo Customer
      - paragraph: demo@shopflow.com
      - paragraph: "9876543210"
      - img
      - text: Sakthepuram 4th line, Naidupeta, Koritepadu, Guntur, Andhra Pradesh - 522007
      - heading "Payment & Status" [level=4]:
        - img
        - text: Payment & Status
      - paragraph: "Method: COD"
      - paragraph: "Payment: PAY_ON_DELIVERY"
      - button "Move to DELIVERED"
      - button "Cancel Order"
    - article:
      - text: "#2"
      - heading "Demo Customer" [level=3]
      - paragraph: "demo@shopflow.com ? Customer ID #2 ? 9/30/2026, 7:59:11 PM"
      - text: DELIVERED
      - heading "Products" [level=4]:
        - img
        - text: Products
      - text: Nova X Pro 5G ? 1 1,499 Subtotal1,499 ? Discount149.9 ? Shipping0 Total 1,349.1
      - heading "Customer & Delivery" [level=4]:
        - img
        - text: Customer & Delivery
      - paragraph: Demo Customer
      - paragraph: demo@shopflow.com
      - paragraph: "9876543210"
      - img
      - text: Sakthepuram 4th line, Naidupeta, Koritepadu, Guntur, Andhra Pradesh - 522007
      - heading "Payment & Status" [level=4]:
        - img
        - text: Payment & Status
      - paragraph: "Method: UPI"
      - paragraph: "Payment: PENDING"
    - article:
      - text: "#1"
      - heading "ShopFlow Admin" [level=3]
      - paragraph: "admin@shopflow.com ? Customer ID #1 ? 9/30/2026, 6:57:51 PM"
      - text: CANCELLED
      - heading "Products" [level=4]:
        - img
        - text: Products
      - text: Power Bank Edition 2 ? 1 29,999 Subtotal29,999 ? Discount500 ? Shipping0 Total 29,499
      - heading "Customer & Delivery" [level=4]:
        - img
        - text: Customer & Delivery
      - paragraph: ShopFlow Admin
      - paragraph: admin@shopflow.com
      - paragraph: "6300621991"
      - img
      - text: Sakthepuram 4th line, Naidupeta, Koritepadu, Guntur, Andhra Pradesh - 522007
      - heading "Payment & Status" [level=4]:
        - img
        - text: Payment & Status
      - paragraph: "Method: COD"
      - paragraph: "Payment: PAY_ON_DELIVERY"
    - heading "Product Management" [level=2]
    - paragraph: Full catalogue control ? pricing, stock, descriptions, status and images.
    - button "Add Product":
      - img
      - text: Add Product
    - img
    - textbox "Search by product name, category or ID..."
    - table:
      - rowgroup:
        - row "Product Category Price MRP Stock Status Actions":
          - columnheader "Product"
          - columnheader "Category"
          - columnheader "Price"
          - columnheader "MRP"
          - columnheader "Stock"
          - columnheader "Status"
          - columnheader "Actions"
      - rowgroup:
        - 'row "PixelEdge 9 PixelEdge 9 #2 ? Phones Electronics 999 1,198.8 0 Active"':
          - 'cell "PixelEdge 9 PixelEdge 9 #2 ? Phones"':
            - img "PixelEdge 9"
            - paragraph: PixelEdge 9
            - paragraph: "#2 ? Phones"
          - cell "Electronics"
          - cell "999"
          - cell "1,198.8"
          - cell "0"
          - cell "Active"
          - cell:
            - button "Edit product":
              - img
            - button "Archive product":
              - img
        - 'row "GalaxyMax Ultra GalaxyMax Ultra #3 ? Phones Electronics 19,999 23,998.8 12 Active"':
          - 'cell "GalaxyMax Ultra GalaxyMax Ultra #3 ? Phones"':
            - img "GalaxyMax Ultra"
            - paragraph: GalaxyMax Ultra
            - paragraph: "#3 ? Phones"
          - cell "Electronics"
          - cell "19,999"
          - cell "23,998.8"
          - cell "12"
          - cell "Active"
          - cell:
            - button "Edit product":
              - img
            - button "Archive product":
              - img
        - 'row "AeroPhone 12 AeroPhone 12 #4 ? Phones Electronics 19,999 22,998.85 10 Active"':
          - 'cell "AeroPhone 12 AeroPhone 12 #4 ? Phones"':
            - img "AeroPhone 12"
            - paragraph: AeroPhone 12
            - paragraph: "#4 ? Phones"
          - cell "Electronics"
          - cell "19,999"
          - cell "22,998.85"
          - cell "10"
          - cell "Active"
          - cell:
            - button "Edit product":
              - img
            - button "Archive product":
              - img
        - 'row "ProBook Air 14 ProBook Air 14 #5 ? Laptops Electronics 19,999 24,998.75 40 Active"':
          - 'cell "ProBook Air 14 ProBook Air 14 #5 ? Laptops"':
            - img "ProBook Air 14"
            - paragraph: ProBook Air 14
            - paragraph: "#5 ? Laptops"
          - cell "Electronics"
          - cell "19,999"
          - cell "24,998.75"
          - cell "40"
          - cell "Active"
          - cell:
            - button "Edit product":
              - img
            - button "Archive product":
              - img
        - 'row "UltraNote 15 UltraNote 15 #6 ? Laptops Electronics 12,999 16,248.75 18 Active"':
          - 'cell "UltraNote 15 UltraNote 15 #6 ? Laptops"':
            - img "UltraNote 15"
            - paragraph: UltraNote 15
            - paragraph: "#6 ? Laptops"
          - cell "Electronics"
          - cell "12,999"
          - cell "16,248.75"
          - cell "18"
          - cell "Active"
          - cell:
            - button "Edit product":
              - img
            - button "Archive product":
              - img
        - 'row "CreatorBook 16 CreatorBook 16 #7 ? Laptops Electronics 29,999 38,998.7 18 Active"':
          - 'cell "CreatorBook 16 CreatorBook 16 #7 ? Laptops"':
            - img "CreatorBook 16"
            - paragraph: CreatorBook 16
            - paragraph: "#7 ? Laptops"
          - cell "Electronics"
          - cell "29,999"
          - cell "38,998.7"
          - cell "18"
          - cell "Active"
          - cell:
            - button "Edit product":
              - img
            - button "Archive product":
              - img
        - 'row "WorkMate 13 WorkMate 13 #8 ? Laptops Electronics 1,999 2,298.85 18 Active"':
          - 'cell "WorkMate 13 WorkMate 13 #8 ? Laptops"':
            - img "WorkMate 13"
            - paragraph: WorkMate 13
            - paragraph: "#8 ? Laptops"
          - cell "Electronics"
          - cell "1,999"
          - cell "2,298.85"
          - cell "18"
          - cell "Active"
          - cell:
            - button "Edit product":
              - img
            - button "Archive product":
              - img
        - 'row "Vision 43 4K Vision 43 4K #9 ? Televisions Electronics 6,999 8,748.75 40 Active"':
          - 'cell "Vision 43 4K Vision 43 4K #9 ? Televisions"':
            - img "Vision 43 4K"
            - paragraph: Vision 43 4K
            - paragraph: "#9 ? Televisions"
          - cell "Electronics"
          - cell "6,999"
          - cell "8,748.75"
          - cell "40"
          - cell "Active"
          - cell:
            - button "Edit product":
              - img
            - button "Archive product":
              - img
        - 'row "Cinema 55 QLED Cinema 55 QLED #10 ? Televisions Electronics 999 1,298.7 40 Active"':
          - 'cell "Cinema 55 QLED Cinema 55 QLED #10 ? Televisions"':
            - img "Cinema 55 QLED"
            - paragraph: Cinema 55 QLED
            - paragraph: "#10 ? Televisions"
          - cell "Electronics"
          - cell "999"
          - cell "1,298.7"
          - cell "40"
          - cell "Active"
          - cell:
            - button "Edit product":
              - img
            - button "Archive product":
              - img
        - 'row "ViewMax 65 ViewMax 65 #11 ? Televisions Electronics 1,299 1,558.8 60 Active"':
          - 'cell "ViewMax 65 ViewMax 65 #11 ? Televisions"':
            - img "ViewMax 65"
            - paragraph: ViewMax 65
            - paragraph: "#11 ? Televisions"
          - cell "Electronics"
          - cell "1,299"
          - cell "1,558.8"
          - cell "60"
          - cell "Active"
          - cell:
            - button "Edit product":
              - img
            - button "Archive product":
              - img
        - 'row "SmartTV 50 SmartTV 50 #12 ? Televisions Electronics 2,999 3,748.75 12 Active"':
          - 'cell "SmartTV 50 SmartTV 50 #12 ? Televisions"':
            - img "SmartTV 50"
            - paragraph: SmartTV 50
            - paragraph: "#12 ? Televisions"
          - cell "Electronics"
          - cell "2,999"
          - cell "3,748.75"
          - cell "12"
          - cell "Active"
          - cell:
            - button "Edit product":
              - img
            - button "Archive product":
              - img
        - 'row "Smart Speaker Smart Speaker #13 ? Home Gadgets Electronics 4,999 6,498.7 60 Active"':
          - 'cell "Smart Speaker Smart Speaker #13 ? Home Gadgets"':
            - img "Smart Speaker"
            - paragraph: Smart Speaker
            - paragraph: "#13 ? Home Gadgets"
          - cell "Electronics"
          - cell "4,999"
          - cell "6,498.7"
          - cell "60"
          - cell "Active"
          - cell:
            - button "Edit product":
              - img
            - button "Archive product":
              - img
        - 'row "Robot Vacuum Robot Vacuum #14 ? Home Gadgets Electronics 29,999 35,998.8 18 Active"':
          - 'cell "Robot Vacuum Robot Vacuum #14 ? Home Gadgets"':
            - img "Robot Vacuum"
            - paragraph: Robot Vacuum
            - paragraph: "#14 ? Home Gadgets"
          - cell "Electronics"
          - cell "29,999"
          - cell "35,998.8"
          - cell "18"
          - cell "Active"
          - cell:
            - button "Edit product":
              - img
            - button "Archive product":
              - img
        - 'row "Air Purifier Air Purifier #15 ? Home Gadgets Electronics 6,999 9,098.7 25 Active"':
          - 'cell "Air Purifier Air Purifier #15 ? Home Gadgets"':
            - img "Air Purifier"
            - paragraph: Air Purifier
            - paragraph: "#15 ? Home Gadgets"
          - cell "Electronics"
          - cell "6,999"
          - cell "9,098.7"
          - cell "25"
          - cell "Active"
          - cell:
            - button "Edit product":
              - img
            - button "Archive product":
              - img
        - 'row "Smart Display Smart Display #16 ? Home Gadgets Electronics 29,999 34,498.85 9 Active"':
          - 'cell "Smart Display Smart Display #16 ? Home Gadgets"':
            - img "Smart Display"
            - paragraph: Smart Display
            - paragraph: "#16 ? Home Gadgets"
          - cell "Electronics"
          - cell "29,999"
          - cell "34,498.85"
          - cell "9"
          - cell "Active"
          - cell:
            - button "Edit product":
              - img
            - button "Archive product":
              - img
        - 'row "Wireless Earbuds Wireless Earbuds #17 ? Accessories Electronics 8,999 11,698.7 12 Active"':
          - 'cell "Wireless Earbuds Wireless Earbuds #17 ? Accessories"':
            - img "Wireless Earbuds"
            - paragraph: Wireless Earbuds
            - paragraph: "#17 ? Accessories"
          - cell "Electronics"
          - cell "8,999"
          - cell "11,698.7"
          - cell "12"
          - cell "Active"
          - cell:
            - button "Edit product":
              - img
            - button "Archive product":
              - img
        - 'row "Mechanical Keyboard Mechanical Keyboard #18 ? Accessories Electronics 8,999 11,248.75 18 Active"':
          - 'cell "Mechanical Keyboard Mechanical Keyboard #18 ? Accessories"':
            - img "Mechanical Keyboard"
            - paragraph: Mechanical Keyboard
            - paragraph: "#18 ? Accessories"
          - cell "Electronics"
          - cell "8,999"
          - cell "11,248.75"
          - cell "18"
          - cell "Active"
          - cell:
            - button "Edit product":
              - img
            - button "Archive product":
              - img
        - 'row "USB-C Hub USB-C Hub #19 ? Accessories Electronics 6,999 8,748.75 60 Active"':
          - 'cell "USB-C Hub USB-C Hub #19 ? Accessories"':
            - img "USB-C Hub"
            - paragraph: USB-C Hub
            - paragraph: "#19 ? Accessories"
          - cell "Electronics"
          - cell "6,999"
          - cell "8,748.75"
          - cell "60"
          - cell "Active"
          - cell:
            - button "Edit product":
              - img
            - button "Archive product":
              - img
        - 'row "Power Bank Power Bank #20 ? Accessories Electronics 29,999 35,998.8 40 Active"':
          - 'cell "Power Bank Power Bank #20 ? Accessories"':
            - img "Power Bank"
            - paragraph: Power Bank
            - paragraph: "#20 ? Accessories"
          - cell "Electronics"
          - cell "29,999"
          - cell "35,998.8"
          - cell "40"
          - cell "Active"
          - cell:
            - button "Edit product":
              - img
            - button "Archive product":
              - img
        - 'row "Classic Oxford Shirt Classic Oxford Shirt #21 ? Men Clothing 499 573.85 18 Active"':
          - 'cell "Classic Oxford Shirt Classic Oxford Shirt #21 ? Men"':
            - img "Classic Oxford Shirt"
            - paragraph: Classic Oxford Shirt
            - paragraph: "#21 ? Men"
          - cell "Clothing"
          - cell "499"
          - cell "573.85"
          - cell "18"
          - cell "Active"
          - cell:
            - button "Edit product":
              - img
            - button "Archive product":
              - img
    - heading "Product Image Manager" [level=2]
    - paragraph: "Admin-only drag-and-drop image upload and removal. Supported formats: JPG, PNG and WebP."
    - img "PixelEdge 9"
    - paragraph: "#2 ? PixelEdge 9"
    - img
    - text: Upload / Drop
    - button "Remove Image":
      - img
      - text: Remove Image
    - img "GalaxyMax Ultra"
    - paragraph: "#3 ? GalaxyMax Ultra"
    - img
    - text: Upload / Drop
    - button "Remove Image":
      - img
      - text: Remove Image
    - img "AeroPhone 12"
    - paragraph: "#4 ? AeroPhone 12"
    - img
    - text: Upload / Drop
    - button "Remove Image":
      - img
      - text: Remove Image
    - img "ProBook Air 14"
    - paragraph: "#5 ? ProBook Air 14"
    - img
    - text: Upload / Drop
    - button "Remove Image":
      - img
      - text: Remove Image
    - img "UltraNote 15"
    - paragraph: "#6 ? UltraNote 15"
    - img
    - text: Upload / Drop
    - button "Remove Image":
      - img
      - text: Remove Image
    - img "CreatorBook 16"
    - paragraph: "#7 ? CreatorBook 16"
    - img
    - text: Upload / Drop
    - button "Remove Image":
      - img
      - text: Remove Image
    - img "WorkMate 13"
    - paragraph: "#8 ? WorkMate 13"
    - img
    - text: Upload / Drop
    - button "Remove Image":
      - img
      - text: Remove Image
    - img "Vision 43 4K"
    - paragraph: "#9 ? Vision 43 4K"
    - img
    - text: Upload / Drop
    - button "Remove Image":
      - img
      - text: Remove Image
    - img "Cinema 55 QLED"
    - paragraph: "#10 ? Cinema 55 QLED"
    - img
    - text: Upload / Drop
    - button "Remove Image":
      - img
      - text: Remove Image
    - img "ViewMax 65"
    - paragraph: "#11 ? ViewMax 65"
    - img
    - text: Upload / Drop
    - button "Remove Image":
      - img
      - text: Remove Image
    - img "SmartTV 50"
    - paragraph: "#12 ? SmartTV 50"
    - img
    - text: Upload / Drop
    - button "Remove Image":
      - img
      - text: Remove Image
    - img "Smart Speaker"
    - paragraph: "#13 ? Smart Speaker"
    - img
    - text: Upload / Drop
    - button "Remove Image":
      - img
      - text: Remove Image
    - img "Robot Vacuum"
    - paragraph: "#14 ? Robot Vacuum"
    - img
    - text: Upload / Drop
    - button "Remove Image":
      - img
      - text: Remove Image
    - img "Air Purifier"
    - paragraph: "#15 ? Air Purifier"
    - img
    - text: Upload / Drop
    - button "Remove Image":
      - img
      - text: Remove Image
    - img "Smart Display"
    - paragraph: "#16 ? Smart Display"
    - img
    - text: Upload / Drop
    - button "Remove Image":
      - img
      - text: Remove Image
    - img "Wireless Earbuds"
    - paragraph: "#17 ? Wireless Earbuds"
    - img
    - text: Upload / Drop
    - button "Remove Image":
      - img
      - text: Remove Image
    - img "Mechanical Keyboard"
    - paragraph: "#18 ? Mechanical Keyboard"
    - img
    - text: Upload / Drop
    - button "Remove Image":
      - img
      - text: Remove Image
    - img "USB-C Hub"
    - paragraph: "#19 ? USB-C Hub"
    - img
    - text: Upload / Drop
    - button "Remove Image":
      - img
      - text: Remove Image
    - img "Power Bank"
    - paragraph: "#20 ? Power Bank"
    - img
    - text: Upload / Drop
    - button "Remove Image":
      - img
      - text: Remove Image
    - img "Classic Oxford Shirt"
    - paragraph: "#21 ? Classic Oxford Shirt"
    - img
    - text: Upload / Drop
    - button "Remove Image":
      - img
      - text: Remove Image
- contentinfo: ShopFlow Admin Console · Secure Operations
```

# Test source

```ts
  1   | import { test, expect } from "@playwright/test";
  2   | 
  3   | const CUSTOMER_EMAIL = "demo@shopflow.com";
  4   | const CUSTOMER_PASSWORD = "Demo@123";
  5   | 
  6   | const ADMIN_EMAIL = "admin@shopflow.com";
  7   | const ADMIN_PASSWORD = "Admin@123";
  8   | 
  9   | async function openLogin(page: any) {
  10  |   await page.goto("/login");
  11  |   await expect(page).toHaveURL(/\/login$/);
  12  | }
  13  | 
  14  | async function selectRole(page: any, role: "Customer" | "Admin") {
  15  |   await page.getByText(role, { exact: true }).click();
  16  | }
  17  | 
  18  | async function submitLogin(
  19  |   page: any,
  20  |   email: string,
  21  |   password: string,
  22  |   role: "Customer" | "Admin"
  23  | ) {
  24  |   await openLogin(page);
  25  | 
  26  |   await page.getByLabel("Email").fill(email);
  27  |   await page.getByLabel("Password").fill(password);
  28  |   await selectRole(page, role);
  29  | 
  30  |   await page.getByRole("button", { name: /sign in/i }).click();
  31  | }
  32  | 
  33  | async function loginAsAdmin(page: any) {
  34  |   await submitLogin(
  35  |     page,
  36  |     ADMIN_EMAIL,
  37  |     ADMIN_PASSWORD,
  38  |     "Admin"
  39  |   );
  40  | 
  41  |   await expect(page).toHaveURL(/\/app\/admin$/, {
  42  |     timeout: 10000,
  43  |   });
  44  | }
  45  | 
  46  | async function openAdmin(page: any) {
  47  |   await loginAsAdmin(page);
  48  | 
  49  |   await page.goto("/app/admin");
  50  | 
  51  |   await expect(
  52  |     page.getByRole("heading", {
  53  |       name: /shopflow admin command center/i,
  54  |     })
  55  |   ).toBeVisible({ timeout: 10000 });
  56  | }
  57  | 
  58  | test.describe("Admin Authentication & Authorization E2E", () => {
  59  |   test("ADMIN-AUTH-01 - Login page renders", async ({ page }) => {
  60  |     await openLogin(page);
  61  | 
  62  |     await expect(page.getByLabel("Email")).toBeVisible();
  63  |     await expect(page.getByLabel("Password")).toBeVisible();
  64  | 
  65  |     await expect(
  66  |       page.getByRole("button", { name: /sign in/i })
  67  |     ).toBeVisible();
  68  |   });
  69  | 
  70  |   test("ADMIN-AUTH-02 - Valid admin credentials login successfully", async ({
  71  |     page,
  72  |   }) => {
  73  |     await loginAsAdmin(page);
  74  | 
> 75  |     await expect(page).toHaveURL(/\/app$/);
      |                        ^ Error: expect(page).toHaveURL(expected) failed
  76  |   });
  77  | 
  78  |   test("ADMIN-AUTH-03 - Wrong admin password is rejected", async ({
  79  |     page,
  80  |   }) => {
  81  |     await submitLogin(
  82  |       page,
  83  |       ADMIN_EMAIL,
  84  |       "WrongPassword@123",
  85  |       "Admin"
  86  |     );
  87  | 
  88  |     await expect(page).toHaveURL(/\/login$/);
  89  |     await expect(page).not.toHaveURL(/\/app/);
  90  |   });
  91  | 
  92  |   test("ADMIN-AUTH-04 - Unknown admin email is rejected", async ({
  93  |     page,
  94  |   }) => {
  95  |     await submitLogin(
  96  |       page,
  97  |       "unknown-admin-shopflow@example.com",
  98  |       ADMIN_PASSWORD,
  99  |       "Admin"
  100 |     );
  101 | 
  102 |     await expect(page).toHaveURL(/\/login$/);
  103 |     await expect(page).not.toHaveURL(/\/app/);
  104 |   });
  105 | 
  106 |   test("ADMIN-AUTH-05 - Admin credentials cannot login as Customer", async ({
  107 |     page,
  108 |   }) => {
  109 |     await submitLogin(
  110 |       page,
  111 |       ADMIN_EMAIL,
  112 |       ADMIN_PASSWORD,
  113 |       "Customer"
  114 |     );
  115 | 
  116 |     await expect(page).toHaveURL(/\/login$/);
  117 |     await expect(page).not.toHaveURL(/\/app/);
  118 |   });
  119 | 
  120 |   test("ADMIN-AUTH-06 - Customer credentials cannot login as Admin", async ({
  121 |     page,
  122 |   }) => {
  123 |     await submitLogin(
  124 |       page,
  125 |       CUSTOMER_EMAIL,
  126 |       CUSTOMER_PASSWORD,
  127 |       "Admin"
  128 |     );
  129 | 
  130 |     await expect(page).toHaveURL(/\/login$/);
  131 |     await expect(page).not.toHaveURL(/\/app/);
  132 |   });
  133 | 
  134 |   test("ADMIN-AUTH-07 - Empty email does not authenticate", async ({
  135 |     page,
  136 |   }) => {
  137 |     await openLogin(page);
  138 | 
  139 |     await page.getByLabel("Email").fill("");
  140 |     await page.getByLabel("Password").fill(ADMIN_PASSWORD);
  141 |     await page.getByText("Admin", { exact: true }).click();
  142 | 
  143 |     await page.getByRole("button", { name: /sign in/i }).click();
  144 | 
  145 |     await expect(page).toHaveURL(/\/login$/);
  146 |   });
  147 | 
  148 |   test("ADMIN-AUTH-08 - Empty password does not authenticate", async ({
  149 |     page,
  150 |   }) => {
  151 |     await openLogin(page);
  152 | 
  153 |     await page.getByLabel("Email").fill(ADMIN_EMAIL);
  154 |     await page.getByLabel("Password").fill("");
  155 |     await page.getByText("Admin", { exact: true }).click();
  156 | 
  157 |     await page.getByRole("button", { name: /sign in/i }).click();
  158 | 
  159 |     await expect(page).toHaveURL(/\/login$/);
  160 |   });
  161 | 
  162 |   test("ADMIN-AUTH-09 - Admin can access Admin Command Center", async ({
  163 |     page,
  164 |   }) => {
  165 |     await openAdmin(page);
  166 | 
  167 |     await expect(
  168 |       page.getByText("Operations / Administration", {
  169 |         exact: true,
  170 |       })
  171 |     ).toBeVisible();
  172 | 
  173 |     await expect(
  174 |       page.getByText("Product Management", {
  175 |         exact: true,
```