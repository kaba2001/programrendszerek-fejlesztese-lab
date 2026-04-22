# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Type-check and build for production (tsc && refine build)
npm run start    # Serve production build
npm run refine   # Run Refine CLI directly
```

There is no lint script in package.json; ESLint is configured via `eslint.config.js`.

## Architecture

This is a **Refine 5** admin panel for a banking app, built with React 19, React Router 7, and Material UI 6.

### Key abstraction: Refine

Refine is the central framework. It provides:
- **Resources**: declarative CRUD resource definitions in `App.tsx` (routes, permissions, icons)
- **Data hooks**: `useDataGrid`, `useForm`, `useMany`, `useAutocomplete` — these call the data provider automatically
- **Auth hooks**: `useLogin`, `useLogout`, `useGetIdentity` — delegated to the auth provider
- `<Authenticated>` component for route guards

### Data flow

`src/providers/data.ts` configures `@refinedev/rest` with a base URL from `VITE_API_URL`. All data fetching goes through Refine hooks — pages never call `fetch`/`axios` directly. The exported `kyInstance` (Ky HTTP client) is available for custom requests that don't map to Refine's standard CRUD (e.g. `POST /api/transactions/send`, `PATCH .../status`).

`src/providers/auth.ts` is currently a **mock** auth provider that stores a username string in `localStorage`. It must be replaced with real JWT auth: call `POST /api/auth/login` with `{ email, password }`, store the returned token, and send it as `Authorization: Bearer <token>` on all subsequent requests. `getIdentity` should call `GET /api/users/me`.

### Routing

React Router 7 via `@refinedev/react-router`. Routes are generated from resource definitions in `App.tsx`. Protected routes wrap children in `<Authenticated>`. Auth pages (`/login`, `/register`, `/forgot-password`) are public and use Refine's `<AuthPage>` component.

### Page pattern

Each resource has pages in `src/pages/<resource>/`. The current `blog_posts` / `categories` resources are placeholders — the real resources are `accounts`, `cards`, `contacts`, `transactions`, and `users` (admin). Pattern per resource:
- **list.tsx**: `useDataGrid()` → MUI DataGrid
- **create.tsx / edit.tsx**: `useForm()` from `@refinedev/react-hook-form` → React Hook Form + MUI fields
- **show.tsx**: `useShow()` → read-only detail view

### Theme

`src/contexts/color-mode/` provides a light/dark mode toggle, persisted to `localStorage`. The `<Header>` component renders the toggle and user identity.

## Backend API

Spring Boot backend at `{{baseUrl}}` (set via `VITE_API_URL`). All endpoints require `Authorization: Bearer <token>` except auth. IDs are UUIDs; account numbers are IBAN format.

| Group | Method | Path | Notes |
|---|---|---|---|
| Auth | POST | `/api/auth/login` | `{ email, password }` → JWT token |
| User | GET | `/api/users/me` | own profile |
| User | PATCH | `/api/users/me` | `{ firstName, lastName }` |
| Accounts | GET | `/api/accounts` | own accounts |
| Accounts | GET | `/api/accounts/:id` | |
| Cards | GET | `/api/cards` | own cards |
| Cards | GET | `/api/cards/:id` | |
| Cards | PATCH | `/api/cards/:id/status` | `{ isLocked: boolean }` |
| Contacts | GET | `/api/contacts` | |
| Contacts | GET | `/api/contacts/:id` | |
| Contacts | POST | `/api/contacts` | `{ partnerName, partnerAccountNumber }` |
| Contacts | DELETE | `/api/contacts/:id` | |
| Transactions | GET | `/api/transactions?accountId=:id` | filtered by account |
| Transactions | POST | `/api/transactions/send` | `{ fromAccountId, toAccountNumber, amount, description }` |
| Admin — accounts | GET/DELETE | `/api/admin/accounts[/:id]` | |
| Admin — accounts | PATCH | `/api/admin/accounts/:id/status` | `{ status: "ACTIVE" \| ... }` |
| Admin — cards | GET/POST/DELETE | `/api/admin/cards[/:id]` | POST: `{ accountId, cardType: "VIRTUAL" }` |
| Admin — cards | PATCH | `/api/admin/cards/:id/status` | `{ isLocked: boolean }` |
| Admin — users | GET/DELETE | `/api/admin/users[/:id]` | |
| Admin — users | PATCH | `/api/admin/users/:id/status` | `{ status: "SUSPENDED" \| ... }` |
| Admin — transactions | GET | `/api/admin/transactions` | all transactions |

## Environment

```
VITE_API_URL=http://localhost:8080/   # point at the Spring Boot backend
```

Set in `.env`. The `.npmrc` sets `legacy-peer-deps=true` — keep this when adding packages.
