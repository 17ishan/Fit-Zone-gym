# FitZone Gym — monorepo

One repository, four deployable parts plus a shared cloud database.

| Folder | What it is | Stack | Hosts on |
| --- | --- | --- | --- |
| [`backend/`](backend) | REST API, auth, data | Java 17 · Spring Boot 3.3 · JPA/Flyway | Render (Docker) |
| [`frontend-users/`](frontend-users) | Public user site | Vite · React 19 · Tailwind | Vercel |
| [`frontend-admin/`](frontend-admin) | Admin portal | Vite · React 19 · Tailwind | Vercel |
| [`frontend-users-app/`](frontend-users-app) | Mobile app (wraps the user site) | Capacitor (Android/iOS) | App stores |
| — | Database | PostgreSQL (Supabase) | Supabase |

Auth is Google Sign-In + email/password; the backend verifies the Google ID token and
issues its own HS256 JWT. Admin access is gated by an email allowlist. Money is stored as
integer paise.

## Prerequisites

- **Node** 20+ and a package manager (npm or pnpm)
- **Java** 17 + Maven (or just Docker) for the backend
- A PostgreSQL database (the project uses Supabase)

## Run locally

Each part is independent — copy its `.env.example` to `.env` and fill in values first.

```bash
# Backend  (http://localhost:8080)
cd backend && mvn spring-boot:run

# User site  (http://localhost:5173)
cd frontend-users && npm install && npm run dev

# Admin portal  (http://localhost:5174)
cd frontend-admin && npm install && npm run dev

# Mobile app (builds the user site, then opens the native project)
cd frontend-users-app && npm install && npm run build && npm run open:android
```

## Configuration

Secrets live in per-folder `.env` files (gitignored); each folder has a committed
`.env.example` template. Never commit real `.env` files or the `Root key/` keystore.

## Deployment

See [docs/DEPLOY.md](docs/DEPLOY.md) for the full Vercel (frontends) + Render (backend)
walkthrough, and [docs/SETUP.md](docs/SETUP.md) for first-time local setup.
