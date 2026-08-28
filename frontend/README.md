# Lending Library — Frontend

Angular frontend for the Community Tool/Equipment Lending Library, consuming the Spring Boot backend.

## What's included
- **Auth**: `AuthService`, JWT interceptor (attaches `Authorization: Bearer <token>` to every request), route guard
- **Login page**: `/login` — logs in against `POST /api/auth/login`
- **Catalog page**: `/items` — lists items from `GET /api/items` (protected by the auth guard)

## Setup

1. Extract this into a folder, e.g. `lending-library-ui`
2. Open it in VS Code
3. Open a terminal and run:
   ```bash
   npm install
   ```
4. Make sure your backend (`lending-library-fresh`) is running on `http://localhost:8080`
5. Run the frontend:
   ```bash
   npm start
   ```
6. Open `http://localhost:4200`

## Default login
Backend seeds a default admin on startup:
- Email: `admin@example.com`
- Password: `adminpass123`

## Structure
```
src/app/
  core/auth/          AuthService, interceptor, guard
  features/auth/login/       Login page
  features/catalog/item-list/  Catalog browse page
  app.config.ts        HttpClient + interceptor + router setup
  app.routes.ts         Route definitions
```

## Next steps (not yet built)
- Reservation flow (place/cancel reservations)
- Staff checkout/return screens
- Admin catalog/staff management pages
