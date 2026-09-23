# TaskFlow — MERN Stack Task Management System

A modern, full-stack task management application built with the **MERN** stack (MongoDB, Express.js, React.js, Node.js). It features role-based access (User / Admin), JWT authentication, task assignment, advanced filtering, statistics charts, dark mode, and a polished SaaS-style responsive UI — suitable for a portfolio project or MERN Stack interview demo.

![Stack](https://img.shields.io/badge/Stack-MERN-blue) ![Auth](https://img.shields.io/badge/Auth-JWT%20%2B%20bcrypt-green) ![UI](https://img.shields.io/badge/UI-Tailwind%20CSS%20%2B%20Recharts-purple)

---

## ✨ Features

### Authentication
- Register with full-name, email & password (bcrypt-hashed)
- Login with JWT (`30d` expiry)
- Role-based redirect (normal user → User Dashboard, admin → Admin Dashboard)
- Protected routes + admin-only middleware

### User Features
- **Dashboard** — total / todo / in-progress / completed / overdue / high-priority stats with a Recharts status chart and a recent-tasks table
- **My Tasks** — searchable, sortable, paginated task list (view / edit / delete / quick status change)
- **Add Task** — create tasks with category, priority, status, due date
- **Edit Task** — update your own tasks
- **Filter Tasks** — advanced search + filter by status / priority / category / due date + sorting (newest, oldest, due date, priority)
- **Profile** — update name & avatar (URL-based), view account info

### Admin Features
- **Admin Dashboard** — total users / tasks / completed / pending / in-progress / overdue stats, priority chart, recent activity
- **User Management** — view, edit, change role, delete users (with task cleanup + confirmation)
- **Task Management** — view ALL users' tasks, filter, change status, edit, delete
- **Task Assignment** — create a task and assign it to any registered user

### Security
- JWT auth, bcrypt password hashing
- Passwords never included in API responses
- Users can only access/update/delete **their own** tasks
- Admin middleware protects all admin-only routes
- Validation on every API input (email format, field sizes, enums, IDs)

### UI / UX
- Tailwind CSS + Lucide icons + Recharts
- Prioritized colors (Low green · Medium yellow · High red)
- Status colors (Todo gray · In Progress blue · Completed green)
- Loading spinners, empty states, error toasts (react-hot-toast), confirmation dialogs
- Fully responsive (desktop / tablet / mobile) with sliding sidebar
- Dark / light mode (system-aware)

---

## 🛠 Tech Stack

| Layer     | Technology                                          |
|-----------|-----------------------------------------------------|
| Frontend  | React 18, React Router 6, Vite, Tailwind CSS, Axios |
| UI        | Lucide React, Recharts, react-hot-toast             |
| Backend   | Node.js, Express 4                                  |
| Database  | MongoDB (Mongoose 8)                                |
| Auth      | JWT (`jsonwebtoken`) + `bcryptjs`                   |

---

## 📁 Project Structure

```
taskflow/
├── package.json              # root scripts (concurrently)
├── README.md
├── .gitignore
├── server/                   # Express REST API
│   ├── package.json
│   ├── .env.example
│   ├── server.js
│   ├── config/db.js
│   ├── models/User.js, Task.js
│   ├── controllers/authController.js, taskController.js, adminController.js
│   ├── routes/authRoutes.js, taskRoutes.js, adminRoutes.js
│   ├── middleware/auth.js, admin.js, errorHandler.js
│   └── utils/generateToken.js, validate.js, seed.js
└── client/                   # React frontend
    ├── package.json
    ├── vite.config.js        # dev proxy to /api
    ├── tailwind.config.js
    ├── index.html
    └── src/
        ├── App.jsx           # routing
        ├── main.jsx
        ├── index.css         # Tailwind + component classes
        ├── components/
        │   ├── layout/       # Sidebar, Topbar, AppShell, ProtectedRoute, ThemeToggle
        │   ├── ui/           # Spinner, Badge, StatCard, Modal, Pagination...
        │   ├── tasks/        # TaskCard, TaskForm, TaskDetail
        │   └── charts/       # TaskStatusChart, TaskBarChart
        ├── pages/auth/       # Login, Register
        ├── pages/user/       # UserDashboard, MyTasks, AddTask, EditTask, FilterTasks
        ├── pages/admin/      # AdminDashboard, AdminTasks, AdminAssignTask, AdminEditTask, AdminUsers
        ├── layouts/          # UserLayout, AdminLayout
        ├── context/          # AuthContext, ThemeContext
        ├── services/         # api.js (axios), apiService.js
        ├── hooks/            # useTasks.js
        └── utils/            # constants.js, helpers.js
```

---

## ✅ Prerequisites

- **Node.js** ≥ 18 (LTS recommended)
- **MongoDB** — local install **or** [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier) connection string
- **VS Code** (recommended)

---

## 🚀 Getting Started

### 1. Install dependencies

Run from the project root (`taskflow/`):

```bash
npm run install:all
```

This installs the root, `server/`, and `client/` dependencies.

### 2. Configure environment variables

Copy `.env.example` to `.env` in the server folder:

```bash
# server/.env
cp server/.env.example server/.env
```

Edit `server/.env`:

```env
MONGO_URI=mongodb://localhost:27017/taskflow
PORT=5000
JWT_SECRET=type_a_long_random_secret_here
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
```

> **Using MongoDB Atlas?** Replace `MONGO_URI` with your cluster connection string, e.g.
> `mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/taskflow`.

### 3. (Optional) Seed demo data

```bash
npm run seed
```

Creates a demo admin + user with sample tasks:

| Role  | Email                  | Password  |
|-------|------------------------|-----------|
| Admin | `admin@taskflow.com`   | `admin123`|
| User  | `demo@taskflow.com`    | `demo123` |

### 4. Run the app

```bash
npm run dev
```

- Backend API → http://localhost:5000
- Frontend app → http://localhost:5173

Or run them separately:

```bash
npm run dev:server   # backend only
npm run dev:client   # frontend only
```

---

## 📘 REST API Documentation

Base URL (dev): `http://localhost:5000/api`

### Auth

| Method | Endpoint              | Description                | Auth    |
|--------|-----------------------|----------------------------|---------|
| POST   | `/api/auth/register`  | Register a new user        | Public  |
| POST   | `/api/auth/login`     | Login, returns JWT token   | Public  |
| GET    | `/api/auth/profile`   | Get current user profile   | Private |
| PUT    | `/api/auth/profile`   | Update name / profileImage | Private |

**Register example**

```
POST /api/auth/register

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123",
  "confirmPassword": "secret123"
}

→ 201 { _id, name, email, role, profileImage, createdAt, message }
```

**Login example**

```
POST /api/auth/login

{ "email": "admin@taskflow.com", "password": "admin123" }

→ 200 { _id, name, email, role, profileImage, createdAt, token }
```

### Tasks (private)

| Method | Endpoint               | Description                            |
|--------|------------------------|----------------------------------------|
| POST   | `/api/tasks`           | Create a task (admins can assign)      |
| GET    | `/api/tasks`           | List own tasks (filters & pagination)  |
| GET    | `/api/tasks/stats`     | Dashboard statistics for current user  |
| GET    | `/api/tasks/:id`       | Get a task (own tasks only)            |
| PUT    | `/api/tasks/:id`       | Update a task (own tasks only)         |
| DELETE | `/api/tasks/:id`       | Delete a task (own tasks only)         |

**Query parameters** for `GET /api/tasks`:

```
?search=react&status=in-progress&priority=high&category=Development
&dueDate=2026-12-01&sort=newest&page=1&limit=10
```

`sort` accepts: `newest` (default) · `oldest` · `due-date` · `priority`
Response shape: `{ tasks: [], pagination: { total, page, limit, pages } }`

**Task fields**

```json
{
  "title": "Build the login page",
  "description": "Responsive login with validation",
  "category": "Development",
  "priority": "high",
  "status": "todo",
  "dueDate": "2026-12-01T00:00:00.000Z",
  "userId": "65f7c1a2b3c4d5e6f7a8b9c0"
}
```

- `category`: `Development | Design | Testing | Documentation | Meeting | Other`
- `priority`: `low | medium | high`
- `status`: `todo | in-progress | completed`
- `userId` is only honored when the caller is an **admin** (task assignment).
- Authenticate with header: `Authorization: Bearer <token>`

### Admin (private + admin role)

| Method | Endpoint             | Description                      |
|--------|----------------------|----------------------------------|
| GET    | `/api/admin/stats`   | Platform-wide statistics & charts|
| GET    | `/api/admin/users`   | List users (search/role/page)    |
| PUT    | `/api/admin/users/:id` | Update name / role             |
| DELETE | `/api/admin/users/:id` | Delete user + their tasks      |
| GET    | `/api/admin/tasks`   | List ALL tasks (with filters)    |
| DELETE | `/api/admin/tasks/:id` | Delete any task                |

### Response codes

- `200` success · `201` created · `400` validation / duplicate / invalid ID
- `401` unauthenticated / bad token · `403` forbidden (non-admin or foreign task) · `404` not found · `500` server error

---

## 🧪 Error Handling

Every failure returns a friendly JSON message, e.g.:

- Invalid login → `401 { "message": "Invalid email or password" }`
- Duplicate email → `400 { "message": "An account with this email already exists" }`
- Foreign task access → `403 { "message": "Not authorized to modify this task" }`
- Malformed ID → `400 { "message": "Invalid task ID" }`
- Route not found → `404 { "message": "Route not found - ..." }`
- Validation → `400 { "message": "..." }` (Mongoose `ValidationError` aggregated)

---

## 🖥 Deployment Notes (optional)

1. Set `VITE_API_URL` in `client/.env` to your deployed API URL (or serve the frontend build from the Express app).
2. `npm run build` in `client/` produces a static bundle in `client/dist`.
3. Set real `JWT_SECRET` and Atlas `MONGO_URI` in production environments.

---

## 📚 Useful Scripts

| Command (root)       | Action                              |
|----------------------|-------------------------------------|
| `npm run install:all`| Install all dependencies            |
| `npm run dev`        | Run backend + frontend together     |
| `npm run dev:server` | Backend only (port 5000)            |
| `npm run dev:client` | Frontend only (port 5173)           |
| `npm run seed`       | Seed demo users & tasks             |
| `npm run build`      | Production build of the frontend    |

---

## 🤝 Notes for Interviews

Be ready to explain:
- How `bcrypt` salts & hashes passwords, and why we never store plain text
- The JWT flow: sign on login, `Authorization: Bearer` header, verified in `auth.js` middleware
- The difference between `protect` and `admin` middleware
- How authorization prevents a user from editing another user's task
- How the filter/sort/pagination query is built server-side without exposing raw query injection
- Why `select: false` on the password field prevents leaking it in API responses

---

Built with ❤️ as a complete MERN Stack portfolio project.