# Netbank

A full-stack banking application with a Spring Boot backend and a React/Refine admin panel frontend.

## Project Structure

```
.
├── netbank-backend-spring/   # Spring Boot REST API
├── netbank-frontend-react/   # Refine 5 admin panel (React + MUI)
└── start-dev-envs.sh         # Dev environment launcher (tmux)
```

## Quick Start

The easiest way to start the entire development environment is:

```bash
bash start-dev-envs.sh
```

This opens a tmux session with:
- **Pane 0.0** — Spring Boot backend (`./mvnw spring-boot:run`)
- **Pane 0.1** — Vite dev server (`npm run dev`)
- **Window 1** — Neovim in `netbank-backend-spring/`
- **Window 2** — Neovim in `netbank-frontend-react/`
- **Windows 3–4** — Claude Code instances for BE and FE

To use local network IP instead of `localhost` (e.g. for testing on another device):

```bash
bash start-dev-envs.sh ln
```

---

## Backend — `netbank-backend-spring`

Spring Boot 3 REST API backed by PostgreSQL, secured with stateless JWT authentication.

### PostgreSQL Setup

**Install PostgreSQL:**

```bash
# Arch Linux
sudo pacman -S postgresql

# Ubuntu / Debian
sudo apt install postgresql
```

**Initialize and start the service (Linux only):**

```bash
# First-time init (Arch only — skip on Ubuntu/Debian, it's done automatically)
sudo -u postgres initdb -D /var/lib/postgres/data

sudo systemctl enable --now postgresql
```

**Create a database user and database:**

```bash
sudo -u postgres psql
```

Inside the `psql` shell:

```sql
CREATE USER netbank_user WITH PASSWORD 'your_password';
CREATE DATABASE netbank_spring OWNER netbank_user;
\q
```

### Setup

```bash
cd netbank-backend-spring
cp .env.example .env   # fill in DB credentials and JWT secret
```

Required environment variables:

```
SPRING_NETBANK_DB_URL=jdbc:postgresql://localhost:5432/netbank_spring
SPRING_NETBANK_DB_USER=...
SPRING_NETBANK_DB_PASSWORD=...
SPRING_JWT_SECRET=...
```

### Commands

```bash
./mvnw spring-boot:run          # Run
./mvnw clean package            # Build
bash make.sh                    # Scaffold a new feature
bash clear-db.sh                # Drop and recreate the database
```

### Architecture

```
dev.kabastack.netbank/
├── auth/           # Login endpoint, JWT token issuance
├── user/           # User CRUD (AdminUserController for admin ops)
├── account/        # Bank account management
├── card/           # Card management
├── contact/        # Saved payment recipients
└── core/
    └── security/   # SecurityConfig, JwtAuthenticationFilter, JwtService
```

Layered design: `Controller → Service → Repository`. Services own all business logic and authorization checks.

Full API documentation is available as a Postman collection at `documentations/NetbankAppSpring.postman_collection.json`. Import it into Postman and set the `baseUrl` and `apiToken` collection variables to get started.

**Security:** stateless JWT (HMAC-SHA256 via JJWT 0.12.6). Routes:
- `/api/auth/**` — public
- `/api/admin/**` — `ADMIN` role only
- everything else — authenticated

**Database:** PostgreSQL with Flyway migrations (`src/main/resources/db/migration/`). JPA is set to `ddl-auto=validate` — schema changes require a new migration file (`V{n}__description.sql`). All PKs are UUIDs.

---

## Frontend — `netbank-frontend-react`

Refine 5 admin panel built with React 19, React Router 7, and Material UI 6.

### Setup

```bash
cd netbank-frontend-react
cp .env.example .env   # set VITE_API_URL
```

Required environment variable:

```
VITE_API_URL=http://localhost:8080/
```

### Commands

```bash
npm run dev      # Start development server
npm run build    # Type-check and build for production
npm run start    # Serve production build
```

### Architecture

The app is built around **Refine** conventions:

- **Resources** declared in `App.tsx` drive all routes and CRUD operations.
- **Data hooks** (`useDataGrid`, `useForm`, `useShow`, etc.) call the data provider automatically — pages never call `fetch`/`axios` directly.
- **Auth hooks** (`useLogin`, `useLogout`, `useGetIdentity`) are delegated to the auth provider.
- `kyInstance` (Ky HTTP client, exported from `src/providers/data.ts`) is used for non-standard requests such as `POST /api/transactions/send`.

Pages live in `src/pages/<resource>/` and follow the pattern:
- `list.tsx` — `useDataGrid()` → MUI DataGrid
- `create.tsx` / `edit.tsx` — `useForm()` → React Hook Form + MUI fields
- `show.tsx` — `useShow()` → read-only detail view

Resources: `accounts`, `cards`, `contacts`, `transactions`, `users` (admin).
