# Day 11 Requirement Coverage Checklist

| Requirement | Implementation | Verification |
|---|---|---|
| React Components | AppLayout, ProtectedRoute, pages and reusable UI sections | Run frontend and navigate pages |
| JSX | All React pages/components use JSX | Vite build |
| Props / composition | AppLayout + Outlet composition and shared components | Route rendering |
| Conditional rendering | Loading, empty cart/orders, errors, image/no-image states | UI flow |
| List rendering | Product cards, cart items, orders, WebSocket events | UI flow |
| useState | Forms, loading, products, cart, orders, messages | Interactions |
| useEffect | API loading and WebSocket lifecycle | Page load / Orders |
| useRef | File input references and WebSocket reference | Product image / Orders |
| Controlled inputs | Login, register and product forms | Form entry |
| Event handling | Submit, click, upload, logout, status update | UI interactions |
| Router v6 | react-router-dom 6.x | Route navigation |
| Nested routes | `/app/*` under protected AppLayout | Navigation |
| Outlet | AppLayout renders child route content | Dashboard/products/cart/orders |
| useParams | ProductDetails reads `productId` | Product details route |
| useNavigate | Login, logout and order flows | Navigation after actions |
| Axios service layer | `src/services/api.js` | All API calls use service methods |
| Axios request interceptor | Adds Bearer JWT from localStorage | Authenticated API calls |
| Axios response interceptor | Handles 401 and redirects to login | Expired/invalid token |
| Protected routes | ProtectedRoute wraps `/app/*` | Logout then visit `/app` |
| FastAPI integration | React calls Day 10 endpoints | Full-stack flow |
| JWT authentication | Register/login + stored token | Login + protected APIs |
| Product integration | CRUD + image upload | Products page |
| Redis cart | `/cart` and `/cart/items` | Cart page |
| Orders | `/orders` + status update | Orders page |
| WebSocket | `/ws/orders` | Live events panel |
| Final integration | Full React -> Axios -> FastAPI -> Redis/Celery/WebSocket flow | End-to-end demo |
