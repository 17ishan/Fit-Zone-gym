# FitZone — Local Setup & Architecture

Monorepo with three apps:

| Folder            | Stack                                   | Dev URL                 |
| ----------------- | --------------------------------------- | ----------------------- |
| `backend`         | Java 17 · Spring Boot 3.3 · PostgreSQL  | http://localhost:8080   |
| `frontend-users`  | React 19 · Vite · TS (the public site)  | http://localhost:5173   |
| `frontend-admin`  | React 19 · Vite · TS (the admin portal) | http://localhost:5174   |

`backend-node-archive/` is the retired Node/Fastify backend, kept for reference only.

Authentication: both sites use **Google Sign-In**. The frontend obtains a Google ID token and
sends it to the backend, which verifies it and issues its own JWT. Admin access is restricted to an
**email allowlist** (DB table + `ADMIN_BOOTSTRAP_EMAILS` config).

Money is stored everywhere as **integer minor units (paise)** — `79900` = ₹799.

---

## 1. Database — one shared cloud PostgreSQL (Supabase) for dev + prod

Supabase **is** a managed PostgreSQL server; we use it only as the database engine (the Supabase JS
SDK is no longer used by the frontends). DBeaver is just a GUI client that connects to the same DB.

1. In Supabase → **Project Settings → Database → Connection info**, copy host / port / database /
   user / password.
2. Use the **direct connection (port 5432)** for the backend's Flyway migrations and for DBeaver.
3. The backend creates and owns a dedicated schema **`gym_app`** (so it never collides with any
   existing Supabase tables). Flyway runs `V1__init_schema.sql` (tables) and `V2__seed_plans.sql`
   (the 4 membership plans) automatically on first start.

### DBeaver connection
New connection → PostgreSQL → host/port/db/user/password from above, **SSL mode = require**.
After the backend starts once, browse `gym_app` to see `users`, `plans`, `memberships`, `payments`,
`contact_submissions`, `admin_allowlist`, and `flyway_schema_history`.

---

## 2. Google OAuth setup (one Web Client ID for both sites)

1. Google Cloud Console → **APIs & Services → Credentials → Create Credentials → OAuth client ID →
   Web application**.
2. **Authorized JavaScript origins** — add all of:
   - `http://localhost:5173`
   - `http://localhost:5174`
   - `https://fit-zone-gym-sdge.vercel.app`
   - your admin Vercel domain (e.g. `https://fit-zone-admin.vercel.app`)
   (GIS ID-token flow needs origins, not redirect URIs.)
3. Configure the **OAuth consent screen** and publish it (or add test users) so external Google
   accounts can sign in.
4. Copy the **Client ID** — it goes into all three env files (it is public/safe to expose).

---

## 3. Backend (`backend`)

```bash
cd backend
cp .env.example .env      # then edit values
```

Set in `.env` (loaded as environment variables): `DATABASE_URL`, `DATABASE_USERNAME`,
`DATABASE_PASSWORD`, `APP_JWT_SECRET` (≥32 chars), `GOOGLE_CLIENT_ID`, `ADMIN_BOOTSTRAP_EMAILS`
(your email, so you can log into the admin portal first), `CORS_ALLOWED_ORIGINS`.

Run (PowerShell example to load `.env` then start):

```powershell
Get-Content .env | Where-Object { $_ -and $_ -notmatch '^\s*#' } | ForEach-Object {
  $k,$v = $_ -split '=',2; [System.Environment]::SetEnvironmentVariable($k.Trim(), $v.Trim())
}
mvn spring-boot:run
```

Health check: http://localhost:8080/actuator/health → `{"status":"UP"}`.

Public endpoints (no auth): `GET /api/public/plans`, `POST /api/public/contact`,
`POST /api/auth/google`, `POST /api/auth/admin/google`.

---

## 4. User site (`frontend-users`)

```bash
cd frontend-users
# edit .env: VITE_API_URL=http://localhost:8080 and VITE_GOOGLE_CLIENT_ID=...
npm install   # (deps already present from the original project)
npm run dev   # http://localhost:5173
```

Changes from the old version: plans load from `GET /api/public/plans`; the contact form persists via
`POST /api/public/contact`; a Google sign-in control sits in the navbar; completing a membership
purchase requires being signed in (ties the membership to your Google account).

---

## 5. Admin portal (`frontend-admin`)

```bash
cd frontend-admin
cp .env.example .env   # set VITE_API_URL and VITE_GOOGLE_CLIENT_ID
npm install
npm run dev            # http://localhost:5174
```

Sign in at `/login` with a Google account whose email is in `ADMIN_BOOTSTRAP_EMAILS` (or later added
under **Settings → allowlist**). Non-allowlisted accounts get a 403 and cannot enter.

Pages: Dashboard (stats + charts), Members (CRUD, promote/demote), Memberships, Payments, Plans
(CRUD), Contact Inbox, Settings (admin allowlist).

---

## 6. Deployment notes

- **Backend** deploys to a JVM host (Render / Railway / Fly.io), not Vercel. Set the same env vars
  there. For the running app you may switch `DATABASE_URL` to the Supabase **pooler (port 6543,
  `?pgbouncer=true`)**; keep Flyway/DBeaver on the direct 5432 connection.
- **Two Vercel projects**, same repo, different **Root Directory**: `frontend-users` and
  `frontend-admin`. Each sets `VITE_API_URL` (the deployed backend URL) and `VITE_GOOGLE_CLIENT_ID`.
- Update `CORS_ALLOWED_ORIGINS` and Google authorized origins with the production domains.
