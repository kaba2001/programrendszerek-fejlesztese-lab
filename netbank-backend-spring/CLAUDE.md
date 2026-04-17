# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Build
./mvnw clean package

# Run
./mvnw spring-boot:run

# Test
./mvnw test

# Run a single test class
./mvnw test -Dtest=ClassName

# Scaffold a new feature (Entity, Repository, Service, Controller, Seeder, Migration)
bash make.sh

# Drop and recreate the database
bash clear-db.sh
```

## Environment Setup

Copy `.env.example` to `.env` and fill in the values. The app expects:

```
SPRING_NETBANK_DB_URL=jdbc:postgresql://localhost:5432/netbank_spring
SPRING_NETBANK_DB_USER=...
SPRING_NETBANK_DB_PASSWORD=...
SPRING_JWT_SECRET=...
```

Dev databases can be started via `../start-dev-envs.sh` (Docker Compose in the parent directory).

## Architecture

### Package Structure

```
dev.kabastack.netbank/
├── auth/           # Login endpoint, JWT token issuance
├── user/           # User CRUD (includes AdminUserController for admin-only ops)
├── account/        # Bank account management
├── card/           # Card management
├── contact/        # Saved payment recipients
└── core/
    └── security/   # SecurityConfig, JwtAuthenticationFilter, JwtService, ApplicationConfig
```

Each feature package contains: Entity, Repository (JPA), Service, Controller, and Request/Response DTOs.

### Layered Design

`Controller → Service → Repository`. Services own all business logic and authorization checks. Controllers are thin — they only handle HTTP mapping and call the service.

### Security

Stateless JWT authentication using HMAC-SHA256 (JJWT 0.12.6). `JwtAuthenticationFilter` runs `OncePerRequestFilter`, extracts the `Authorization: Bearer <token>` header, and populates `SecurityContextHolder`.

Route-level access control in `SecurityConfig`:
- `/api/auth/**` — public
- `/api/admin/**` — `ADMIN` role only
- all others — authenticated

User roles: `USER`, `ADMIN`. Statuses: `PENDING`, `ACTIVE`, `SUSPENDED`.

### Authorization Pattern

Services check ownership by comparing the authenticated user's ID against the resource's owner ID, or fall through if the user is `ADMIN`. Example:

```java
if (!user.getId().equals(account.getUser().getId()) && user.getRole() != Role.ADMIN) {
    throw new RuntimeException("Forbidden");
}
```

### Database

PostgreSQL with Flyway migrations in `src/main/resources/db/migration/`. JPA is set to `ddl-auto=validate` — schema changes must go through a new migration file (`V{n}__description.sql`).

All tables use UUIDs as primary keys (`@GeneratedValue(strategy = GenerationType.UUID)`), PostgreSQL-native ENUMs for typed fields (mapped with `@JdbcTypeCode(SqlTypes.NAMED_ENUM)`), and `ON DELETE CASCADE` for FK integrity.

### Entity Relationships

```
User 1──N Account 1──N Card
User 1──N Contact
```

### Seeders

Each feature has a `*Seeder` that implements `CommandLineRunner` with `@Order`. Seeders guard against re-running via `repository.count() > 0`. They use **Datafaker** to generate realistic test data. Seeder order: `UserSeeder` → `AccountSeeder` → `CardSeeder`.

### Lombok & Timestamps

All entities use `@Data` (Lombok). Timestamps are `Instant` fields managed by `@CreationTimestamp` / `@UpdateTimestamp`.
