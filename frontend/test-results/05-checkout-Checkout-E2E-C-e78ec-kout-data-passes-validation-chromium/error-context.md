# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 05-checkout.spec.ts >> Checkout E2E >> CHECKOUT-09: valid checkout data passes validation
- Location: e2e\05-checkout.spec.ts:197:3

# Error details

```
Test timeout of 30000ms exceeded.
```

# Page snapshot

```yaml
- generic [ref=f3e2]:
  - button "Notifications" [ref=f3e4]
  - button "Support" [ref=f3e8]
  - generic [ref=f3e11]:
    - banner [ref=f3e12]:
      - generic [ref=f3e13]:
        - link "shopflow" [ref=f3e14] [cursor=pointer]:
          - /url: /app
        - textbox "Search products, categories and more..." [ref=f3e20]
        - navigation [ref=f3e21]:
          - link "Wishlist" [ref=f3e22] [cursor=pointer]:
            - /url: /app/wishlist
          - link "My Orders" [ref=f3e25] [cursor=pointer]:
            - /url: /app/orders
          - link "1" [ref=f3e30] [cursor=pointer]:
            - /url: /app/cart
          - button "Toggle theme" [ref=f3e36]
          - generic [ref=f3e39]:
            - generic [ref=f3e43]: Demo Customer
            - button "Logout" [ref=f3e44]
    - main [ref=f3e48]:
      - main [ref=f3e49]:
        - heading "Secure Checkout" [level=1] [ref=f3e50]
        - generic [ref=f3e51]:
          - generic [ref=f3e52]:
            - generic [ref=f3e53]:
              - heading "Delivery Address" [level=2] [ref=f3e54]
              - paragraph [ref=f3e58]: We found your saved address. Edit it below if needed.
              - generic [ref=f3e59]:
                - generic [ref=f3e60]:
                  - text: Full name
                  - textbox "Full name" [ref=f3e61]: Demo Customer
                - generic [ref=f3e62]:
                  - text: Phone
                  - textbox "Phone" [ref=f3e63]: "9876543210"
                - generic [ref=f3e64]:
                  - text: Address
                  - textbox "Address" [ref=f3e65]: 123 Main Street
                - generic [ref=f3e66]:
                  - text: City
                  - textbox "City" [ref=f3e67]: Guntur
                - generic [ref=f3e68]:
                  - text: State
                  - textbox "State" [ref=f3e69]: Andhra Pradesh
                - generic [ref=f3e70]:
                  - text: PIN code
                  - textbox "PIN code" [active] [ref=f3e71]: "522001"
            - generic [ref=f3e72]:
              - heading "Payment Method" [level=2] [ref=f3e73]
              - generic [ref=f3e78]:
                - generic [ref=f3e79] [cursor=pointer]:
                  - radio "Cash on Delivery Pay when delivered" [checked] [ref=f3e80]
                  - text: Cash on Delivery
                  - generic [ref=f3e81]: Pay when delivered
                - generic [ref=f3e82] [cursor=pointer]:
                  - radio "UPI Google Pay, PhonePe, BHIM and more" [ref=f3e83]
                  - text: UPI
                  - generic [ref=f3e84]: Google Pay, PhonePe, BHIM and more
                - generic [ref=f3e85] [cursor=pointer]:
                  - radio "Net Banking Major Indian banks" [ref=f3e86]
                  - text: Net Banking
                  - generic [ref=f3e87]: Major Indian banks
                - generic [ref=f3e88] [cursor=pointer]:
                  - radio "Credit / Debit Card Secure card payment gateway ready" [ref=f3e89]
                  - text: Credit / Debit Card
                  - generic [ref=f3e90]: Secure card payment gateway ready
          - complementary [ref=f3e91]:
            - heading "Bill Details" [level=2] [ref=f3e92]
            - generic [ref=f3e93]:
              - generic [ref=f3e94]: Subtotal
              - generic [ref=f3e95]: 1,499
            - generic [ref=f3e96]:
              - generic [ref=f3e97]: Offer discount
              - generic [ref=f3e98]: "-149.9"
            - generic [ref=f3e99]:
              - generic [ref=f3e100]: Delivery
              - generic [ref=f3e101]: FREE
            - generic [ref=f3e103]:
              - generic [ref=f3e104]: Total
              - generic [ref=f3e105]: 1,349.1
            - button "Place Order Â· Pay on Delivery" [ref=f3e106]
            - generic [ref=f3e107]:
              - generic [ref=f3e108]: WELCOME10 Â· 10% off up to â‚¹500
              - generic [ref=f3e109]: SHOP500 Â· â‚¹500 off on orders above â‚¹7,999
              - generic [ref=f3e110]: FREESHIP Â· Free delivery on eligible orders
    - contentinfo [ref=f3e111]: © 2026 ShopFlow · Smart shopping, simple checkout.
```