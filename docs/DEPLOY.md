# Deploying FitZone to production

The pieces live in **three** places — Vercel cannot run the Java backend:

| Component | Host | Notes |
| --- | --- | --- |
| `frontend-users` | **Vercel** (project #1) | Static Vite SPA |
| `frontend-admin` | **Vercel** (project #2) | Static Vite SPA |
| `backend` (Spring Boot) | **Render** (Docker web service) | See `render.yaml` / `backend/Dockerfile` |
| PostgreSQL | **Supabase** (already cloud) | Use the `:5432` session/direct connection so Flyway can run DDL |

Deploy in this order: **backend first** (so you have its URL), then the frontends, then wire CORS + OAuth back together.

---

## 1. Backend → Render

1. Push this repo to GitHub (see git commands at the bottom).
2. Render Dashboard → **New → Blueprint** → pick this repo. It reads `render.yaml` and creates the `fitzone-backend` Docker web service (root dir `backend`).
3. Set the env vars marked `sync: false` in the Render dashboard:

   | Key | Value |
   | --- | --- |
   | `DATABASE_URL` | `jdbc:postgresql://<supabase-host>:5432/postgres?sslmode=require` |
   | `DATABASE_USERNAME` | Supabase DB user |
   | `DATABASE_PASSWORD` | Supabase DB password |
   | `APP_JWT_SECRET` | a fresh ≥32-char random string |
   | `GOOGLE_CLIENT_ID` | your Google OAuth Web client id |
   | `ADMIN_BOOTSTRAP_EMAILS` | comma-separated admin emails |
   | `ADMIN_BOOTSTRAP_PASSWORD` | a strong password (not the placeholder) |
   | `CORS_ALLOWED_ORIGINS` | filled in step 3 (Vercel URLs) |
   | `FRONTEND_USER_URL` / `FRONTEND_ADMIN_URL` | filled in step 3 |

4. Deploy. Health check is `GET /actuator/health`. Note the service URL, e.g. `https://fitzone-backend.onrender.com`.

> Render free tier sleeps on idle — the first request after a while is slow (cold start). Fine for a demo.

## 2. Frontends → Vercel (two separate projects)

For **each** of `frontend-users` and `frontend-admin`:

1. Vercel → **Add New Project** → import this repo.
2. Set **Root Directory** to the subfolder (`frontend-users`, then a second project for `frontend-admin`). Framework auto-detects as Vite; `vercel.json` handles SPA routing + build.
3. Add Environment Variables:
   - `VITE_API_URL` = the Render backend URL from step 1 (no trailing slash)
   - `VITE_GOOGLE_CLIENT_ID` = your Google OAuth Web client id
   - **frontend-users only:** `VITE_GEMINI_API_KEY` — see security note below
4. Deploy. Note each domain, e.g. `https://fitzone.vercel.app` and `https://fitzone-admin.vercel.app`.

## 3. Wire them together

On **Render**, update and redeploy:
- `CORS_ALLOWED_ORIGINS` = `https://<users>.vercel.app,https://<admin>.vercel.app`
- `FRONTEND_USER_URL` = `https://<users>.vercel.app`
- `FRONTEND_ADMIN_URL` = `https://<admin>.vercel.app`

On **Google Cloud Console** → OAuth Web client → **Authorized JavaScript origins**, add both Vercel domains (and keep `http://localhost:5173`, `http://localhost:5174` for local dev).

---

## Security checklist before going live

- **Rotate the Gemini key.** `VITE_GEMINI_API_KEY` is compiled into the public browser bundle and is readable by anyone. The committed history/local `.env` contained a real key — revoke it in Google AI Studio and issue a new one. Best fix: proxy Gemini calls through the backend so the key never ships to the client.
- **Rotate `APP_JWT_SECRET` and the Supabase DB password** if they were ever shared in plaintext, and use fresh values in Render (not the local-dev ones).
- **Change `ADMIN_BOOTSTRAP_PASSWORD`** from the placeholder to a strong value.
- Never commit `.env` — only `.env.example` is tracked.
