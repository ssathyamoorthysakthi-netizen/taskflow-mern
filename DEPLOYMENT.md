# 🚀 Deploying TaskFlow — Backend to Render, Frontend to Vercel

This guide takes the **same GitHub repository** and deploys:
- **Backend** (`server/`) → [Render](https://render.com) — Express REST API
- **Frontend** (`client/`) → [Vercel](https://vercel.com) — React (Vite) SPA
- **Database** → [MongoDB Atlas](https://www.mongodb.com/atlas) (free M0 cluster) — required. Render does **not** host MongoDB.

> The app is also configured to run locally with `npm run dev` — see the main `README.md`.

---

## 0. One-time setup

### A. Push the code to GitHub

```bash
git add .
git commit -m "TaskFlow: full MERN task management app"
git branch -M main
git remote add origin https://github.com/<your-user>/taskflow-mern.git
git push -u origin main
```

> Make sure `server/.env`, `client/.env` and `node_modules` are **not** pushed (they are gitignored).

### B. Create a MongoDB Atlas cluster

1. Go to <https://www.mongodb.com/atlas> → sign up / log in → **Create** a free **M0** cluster.
2. Under **Database Access**, create a database user (e.g. `taskflow`, strong password).
3. Under **Network Access**, add your IP or **Allow access from anywhere** (`0.0.0.0/0`) so Render can connect.
4. Click your cluster → **Connect** → **Drivers**, copy the connection string:

```
mongodb+srv://taskflow:<password>@cluster0.xxxxx.mongodb.net/taskflow
```

Replace `<password>` with your database user's password. (Use `taskflow` as the database name or append it.)

---

## 1. Deploy the backend to Render

### Option A — Blueprint (recommended, file included)

1. Log in at <https://dashboard.render.com> → **New** → **Blueprint**.
2. Connect your GitHub repo and select `taskflow-mern`.
3. Render reads `render.yaml`, which provisions the **taskflow-api** web service automatically.
4. When it finishes, open the service → **Environment**:
   - **MONGO_URI** → your Atlas connection string from step 0B.
   - **CLIENT_URL** → your Vercel frontend URL, e.g. `https://taskflow-mern.vercel.app` (set it later or now — CORS falls back to allowing all if empty).
5. Click **Save** → it redeploys.
6. Open the service **Events/Logs** and confirm `TaskFlow server running on port ...` + `MongoDB Connected`.

### Option B — Manual web service

1. **New** → **Web Service** → connect repo → select `taskflow-mern`.
2. Settings:
   - **Root Directory**: `server`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free
3. Add **Environment Variables**: `MONGO_URI` (Atlas string), `JWT_SECRET` (long random string), `JWT_EXPIRE=30d`, `CLIENT_URL` (Vercel URL).
4. **Create Web Service** and wait for deploy → note the URL, e.g. `https://taskflow-api.onrender.com`.

✅ Verify: open `https://taskflow-api.onrender.com/api/health` → `{ "status": "ok" }`

---

## 2. Deploy the frontend to Vercel

1. Log in at <https://vercel.com> → **Add New** → **Project**.
2. **Import** your `taskflow-mern` GitHub repo.
3. In the **Configure Project** step:
   - **Root Directory** → `client` (Vercel uses `client/vercel.json` for build/output settings).
   - Framework preset auto-detects **Vite** (React).
4. Add **Environment Variable**:
   - `VITE_API_URL` → `https://taskflow-api.onrender.com/api` (your Render backend base URL, **with `/api`**).
5. Click **Deploy**.
6. After deploy, set the deployed URL into Render's `CLIENT_URL` env var and redeploy the backend.

✅ Verify: open `https://taskflow-mern.vercel.app` → register / login → data should load from the Render API in the cloud.

> Vite injects `import.meta.env.VITE_API_URL` at **build time**, so any change to it requires a new deploy/redeploy on Vercel.
> The axios instance automatically falls back to the local `/api` proxy when `VITE_API_URL` is not set.

---

## 3. Redeploy / update

Any `git push` to the repo branch triggers auto-deploys on both platforms (autoDeploy is enabled).

```

```

## Troubleshooting

| Symptom | Fix |
|---|---|
| Backend logs `MongoDB Connected: <host>` but CRUD fails | Check Atlas network access allows `0.0.0.0/0` and the DB user password in `MONGO_URI` |
| Frontend shows "Failed to fetch"/CORS error | Set `CLIENT_URL` on Render to the exact Vercel URL (no trailing slash) and redeploy |
| Login returns 401 on Vercel but works locally | `VITE_API_URL` is missing or stale on Vercel (set + redeploy) |
| `Cannot GET /profile` on Vercel | SPA rewrites are missing — `client/vercel.json` includes them; re-import if needed |
| Port conflict locally | Not deployment-related; kill `node` processes and rerun `npm run dev` |

---

## Demo accounts (fresh Atlas DB has none — register new users)

Only your own registered accounts will exist after deploy. Re-seed locally if you want the demo users: `npm run seed`.