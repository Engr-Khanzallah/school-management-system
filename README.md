# 🏫 School Management System

A full-stack School Management System built to help schools manage students, teachers, classes, attendance, exams, and fees — all from one simple dashboard, accessible from any device with a browser.

---

## 🔗 Live Links

| | Link |
|---|---|
| 🌐 **Live App (use this one)** | https://schoolmanagementsystm.netlify.app |
| ⚙️ **Backend API** (not for direct browsing — used by the app in the background) | https://school-management-system-sigma-blond.vercel.app |
| 🩺 **API Health Check** | https://school-management-system-sigma-blond.vercel.app/api/health |

> 👉 Always share the **Netlify link** with clients and end users. The Vercel link is the backend engine running quietly behind the scenes — opening it directly in a browser is not meant to show a page.

---

## ✨ Features

- **Authentication & Roles** — Admin, Teacher, and Student accounts, each seeing only what's relevant to them
- **Student Management** — Add, edit, and track student records, class, section, and guardian details
- **Teacher Management** — Manage teacher profiles, subjects taught, and assigned classes
- **Classes & Subjects** — Organize classes, sections, and subject-teacher assignments
- **Attendance** — Mark and edit daily attendance; students can view their own attendance percentage
- **Examinations & Results** — Schedule exams, enter marks, and auto-calculate totals, percentages, and grades
- **Fee Management** — Track fee types, due dates, payments, and outstanding balances with receipts
- **Dashboard** — At-a-glance overview of students, teachers, attendance, upcoming exams, and fee collection
- **Works on Any Device** — Responsive design for desktop, tablet, and mobile
- **Offline-Tolerant** — Installed as a PWA; previously loaded pages remain viewable without an internet connection

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS, React Router |
| Backend | Node.js, Express.js |
| Database | MongoDB (Atlas) |
| Authentication | JWT + bcrypt |
| Hosting | Netlify (frontend) + Vercel (backend) |

---

## 🚀 Getting Started (Local Development)

### 1. Backend

```bash
cd server
npm install
cp .env.example .env
# Fill in MONGO_URI (your MongoDB Atlas connection string) and JWT_SECRET
npm run dev
```

Runs at `http://localhost:5000`. Check `http://localhost:5000/api/health` to confirm it's working.

### 2. Frontend

```bash
cd client
npm install
cp .env.example .env
# Set VITE_API_URL to your backend URL + /api
npm run dev
```

Runs at `http://localhost:5173`.

### 3. First-Time Setup

1. Open the app and **create an account** with role **Admin**.
2. Add a **Class** (with sections).
3. Add **Teachers**, then assign them to subjects within a class.
4. Add **Students**, assigning each to a class and section.
5. Start marking attendance, scheduling exams, entering results, and tracking fees.

---

## ☁️ Deployment Settings (for reference)

### Backend — Vercel
| Setting | Value |
|---|---|
| Root Directory | `server` |
| Build Command | *(leave empty)* |
| Output Directory | *(leave empty)* |
| Environment Variables | `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_URL` |

### Frontend — Netlify
| Setting | Value |
|---|---|
| Base Directory | `client` |
| Build Command | `npm run build` |
| Publish Directory | `dist` |
| Environment Variables | `VITE_API_URL` |

> These settings are also captured in `netlify.toml` and `server/vercel.json` in this repo, so a fresh deployment reads them automatically.

---

## 👥 Roles & Permissions

| Action | Admin | Teacher | Student |
|---|:---:|:---:|:---:|
| Manage students | ✅ | View only | — |
| Manage teachers | ✅ | View only | — |
| Manage classes/subjects | ✅ | View only | — |
| Mark attendance | ✅ | ✅ | View own |
| Schedule exams / enter marks | ✅ | Enter marks | View own results |
| Publish results | ✅ | — | — |
| Manage fees | ✅ | — | View own |

---

## 📌 Notes on Offline Support

The app is installable as a Progressive Web App (PWA). Previously visited pages (dashboard, student lists, attendance history, etc.) stay viewable without an internet connection. **Actions that save data** (marking attendance, entering marks, recording payments) still require an active connection, since the database lives in the cloud.

---

## 🔮 Possible Future Additions

Dark mode, a dedicated parent portal, teacher-parent chat, homework submission, push notifications, multi-language support, and AI-based performance insights are not included yet — the project is structured so each can be added cleanly as a new module without reworking what's already built.

---

## 🙋 Support

If something isn't working as expected, check:
1. `https://school-management-system-sigma-blond.vercel.app/api/health` — confirms the backend is reachable
2. Browser console (F12 → Console tab) — shows the exact error if a page misbehaves
3. MongoDB Atlas → Network Access — confirm `0.0.0.0/0` is listed and **Active**