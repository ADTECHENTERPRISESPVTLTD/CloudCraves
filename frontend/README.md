# Cloud Kitchen Ordering Platform — Frontend

Frontend-only implementation for AD TECH Enterprises Task-04.

## Scope
- Customer portal: discover, restaurants, menu, cart, checkout, order tracking, orders, profile.
- Admin portal: login, dashboard, orders, menu, restaurant profile, delivery, settings.
- Mock data and service layer are separated from UI.
- No backend is required for the prototype.

## Setup
```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Production check
```bash
npm run build
npm run start
```

## Mock credentials
Customer:
- Email: customer@example.com
- Password: customer123

Admin:
- Email: admin@cloudkitchen.local
- Password: admin123

## Routes
Customer:
- /
- /restaurants
- /restaurant/[id]
- /cart
- /checkout
- /orders
- /orders/[id]
- /profile

Auth:
- /login
- /register
- /admin/login

Admin:
- /admin
- /admin/orders
- /admin/menu
- /admin/restaurant
- /admin/delivery
- /admin/settings

## Environment
Copy `.env.example` to `.env.local` when a backend is available:
`NEXT_PUBLIC_API_BASE_URL=...`

The service files are the intended replacement point for real API calls.
