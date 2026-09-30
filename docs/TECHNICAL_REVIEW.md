# ShopFlow Day 10–13 Technical Review

## End-to-end flow
Customer → Login → Product discovery → Search/filter/sort → Product details → Wishlist/Cart → Address → Offer calculation → Payment method → Order → Order history.

## Authorization
JWT establishes identity. Backend role checks protect admin operations. Frontend route protection is for UX; backend authorization is the security boundary.

## Validation
Client-side validation should be added/extended with React Hook Form/Zod where appropriate. FastAPI/Pydantic remains authoritative.

## Offers
Current demo rules:
- WELCOME10 concept: 10% off above ₹999
- SHOP500: ₹500 off above ₹7,999
- Free shipping above ₹499
The checkout applies the discount rule automatically.

## Payment
COD, UPI, Net Banking and Card are modeled as payment-method choices. No real money is transferred by this learning implementation. Production requires a PCI-compliant/payment-provider integration and webhook verification.

## Low stock
If stock < 10, product cards/details display an urgency indicator such as `Only 7 left`.

## Admin media
Admin can upload through file selection or drag/drop. Backend validates JPEG/PNG/WebP.

## Scaling notes
Production should use PostgreSQL, object storage, Redis/shared cache, proper migrations, payment gateway, rate limiting, observability, secure token strategy and background workers.
