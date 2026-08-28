# School Management System

A full-stack school management system: authentication with roles (admin/teacher/student), student & teacher management, classes & subjects, attendance, exams & results with auto-graded report cards, and fee tracking with receipts.

## Stack

- **Frontend:** React + Vite, Tailwind CSS, React Router, Axios, PWA (offline shell + cached data)
- **Backend:** Node.js, Express
- **Database:** MongoDB (Atlas or local)
- **Auth:** JWT + bcrypt, role-based route guards on both client and server

## Project structure

```
school-management/
├── client/                  # React app (Vite)
│   ├── src/
│   │   ├── components/      # Layout, Sidebar, Topbar, PrivateRoute, UI primitives
│   │   ├── context/         # AuthContext (login/register/logout, session state)
│   │   ├── pages/           # One page per module
│   │   ├── services/        # Axios instance + per-module API calls
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── vite.config.js       # Includes vite-plugin-pwa for offline support
│
└── server/
    ├── config/db.js         # Mongoose connection
    ├── models/               # User, Student, Teacher, Class, Attendance, Exam, Result, Fee
    ├── controllers/          # Business logic per module
    ├── routes/                # Express routers, wired to auth + role middleware
    ├── middleware/            # JWT auth, role authorization, error handler
    └── server.js
```

## Getting started locally

### 1. Backend

```bash
cd server
npm install
cp .env.example .env
# edit .env: set MONGO_URI (Atlas connection string or local mongodb://127.0.0.1:27017/school-management)
#            set JWT_SECRET to a long random string
npm run dev
```

The API runs on `http://localhost:5000` by default. Health check: `GET /api/health`.

### 2. Frontend

```bash
cd client
npm install
cp .env.example .env
# edit .env if your API isn't on localhost:5000
npm run dev
```

Visit `http://localhost:5173`. Register an account (choose a role — in production, only admins should create other admin/teacher accounts; self-registration here is for getting started quickly).

### 3. First-time data setup

After registering an admin account:
1. Create classes (Classes page) with sections, e.g. class "10" with sections A, B.
2. Add teachers, then assign them to subjects within a class.
3. Add students, assigning them to a class + section.
4. Mark attendance, schedule exams, enter marks, publish results, and track fees.

Note: student/teacher user accounts (for login) and student/teacher records (the data rows) are separate in this schema — an admin creates the record, and a `profileRef` can later be linked to a login account. This keeps roster management independent of who has portal access yet.

## Deployment

**Frontend (Vercel):** import the `client/` folder as its own project. Set the build command to `npm run build`, output directory `dist`, and add the environment variable `VITE_API_URL` pointing to your deployed backend's `/api` path.

**Backend (Vercel or any Node host):** Vercel's serverless functions work best with request/response-style handlers; for a long-running Express app with MongoDB connection pooling, a host like Render, Railway, or Fly.io tends to be smoother than Vercel serverless. If you do deploy to Vercel, wrap `server.js`'s `app` export with `@vercel/node` and add a `vercel.json` rewrite. Either way, set `MONGO_URI`, `JWT_SECRET`, and `CLIENT_URL` (for CORS) as environment variables on the host.

**Database:** create a free MongoDB Atlas cluster, add your deployment's IP (or `0.0.0.0/0` for simplicity during setup) to the network access list, and copy the connection string into `MONGO_URI`.

## Offline notes (important caveat)

MongoDB Atlas is a cloud database — it cannot be reached with zero internet connection, whichever hosting choice you make. What this app does instead is a standard **offline-tolerant PWA** pattern:

- The app shell (HTML/CSS/JS) and previously-fetched API responses (GET requests — dashboard stats, student lists, attendance history, etc.) are cached by a service worker (`vite-plugin-pwa`, `NetworkFirst` strategy). So if you lose connection, pages you've already visited keep showing their last-loaded data, and the app itself still opens.
- **Writes (marking attendance, entering marks, recording payments) still require connectivity** in this version — they are not queued for later sync. The `OfflineBanner` component tells the user when they're offline so this limitation is visible rather than silent.

If true offline writes matter for your use case (e.g., a teacher marking attendance in a classroom with no signal), the next step is adding an IndexedDB-backed outbox: queue mutating requests locally, then replay them against the API when `navigator.onLine` becomes true again, with conflict handling for anything changed elsewhere in the meantime. That's a meaningful chunk of additional work — happy to build it out if it's a priority.

## Roles & permissions summary

| Action | Admin | Teacher | Student |
|---|---|---|---|
| Manage students | ✅ | View only | — |
| Manage teachers | ✅ | View only | — |
| Manage classes/subjects | ✅ | View only | — |
| Mark attendance | ✅ | ✅ | View own |
| Schedule exams / enter marks | ✅ | Enter marks | View own results |
| Publish results | ✅ | — | — |
| Manage fees | ✅ | — | View own |

## Bonus features not yet built

Dark mode, parent portal, teacher-parent chat, homework submission, push notifications, multi-language support, and AI performance analysis are not included in this scaffold — the architecture (role-based auth, modular routes/controllers, React Router pages) is set up so each can be added as a new model + controller + route + page without restructuring what's here.
