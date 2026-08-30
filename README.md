# College Complaint Management System (CCMS)

An enterprise-grade, full-stack **College Complaint Management System (CCMS)** designed to streamline campus grievance reporting, departmental dispatch, resolution timelines, and student verification.

---

## 🚀 Key Features

- **Multi-Role Authentication & Access Control (RBAC)**:
  - **Student Portal**: Lodge detailed grievances with photo/document evidence, monitor live chronological audit timelines, add notes, and verify/close resolved tickets.
  - **Admin Control Center**: Live KPI metrics, Recharts visual analytics, multi-filter master complaint queue, departmental dispatch, staff allocation, and status transitions.
- **Audit-Grade Chronological Timeline**: Every assignment, status transition, resolution note, and student feedback is stamped with timestamp and author signature.
- **Incident Urgency & Lifecycle Workflow**: Structured pipeline (`SUBMITTED` ➔ `UNDER_REVIEW` ➔ `ASSIGNED` ➔ `IN_PROGRESS` ➔ `RESOLVED` ➔ `CLOSED`).
- **Campus Department & Staff CRUD**: Manage campus departments (IT, Maintenance, Electrical, Plumbing, Hostel, etc.) and assign specialist technicians.
- **Secure File Storage & Uploads**: 5MB size limit validation, safe MIME filtering (JPG, PNG, WEBP, PDF) with instant in-browser previews.
- **Live Notifications & Alerts**: In-app unread notifications and real-time badge updates.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, TypeScript, Tailwind CSS, Vite, React Router v7, Lucide Icons, Recharts, React Hook Form, Zod |
| **Backend** | Node.js, Express.js, TypeScript, Prisma ORM, JWT, Bcrypt, Multer, Helmet, Rate Limiter, Morgan |
| **Database** | SQLite (zero-config out-of-the-box) / PostgreSQL compatible via Prisma |

---

## 🔐 Demo Login Credentials

Quick login buttons are built directly into the login screen for 1-click access:

| Role | Email | Password | Pre-seeded Permissions |
|---|---|---|---|
| **Administrator** | `admin@college.edu` | `Admin@123` | Full administrative control, queue dispatch, department & staff management, analytics |
| **Student (Demo 1)** | `student@college.edu` | `Student@123` | Primary student account with 6 pre-seeded complaints in various stages |
| **Student (Demo 2)** | `priya.patel@student.college.edu` | `Student@123` | Electrical Engineering student |
| **Student (Demo 3)** | `rahul.verma@student.college.edu` | `Student@123` | Mechanical Engineering student |
| **Student (Demo 4)** | `sneha.reddy@student.college.edu` | `Student@123` | Information Technology student |
| **Student (Demo 5)** | `amit.kumar@student.college.edu` | `Student@123` | Civil Engineering student |

---

## 📂 Project Structure

```
college-complaint-management-system/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma         # Database schema (User, Complaint, Department, Staff, Attachment, etc.)
│   │   └── seed.ts               # Database seeder (Admin, 5 students, 10 depts, 10 staff, 16 complaints)
│   ├── src/
│   │   ├── config/               # Central environment configuration
│   │   ├── controllers/          # Request controllers (Auth, Complaint, Dept, Staff, Dashboard, Upload)
│   │   ├── middleware/           # JWT Auth, Role-based access, Error handling, Multer upload
│   │   ├── prisma/               # Prisma singleton client
│   │   ├── routes/               # Modular Express API routes
│   │   ├── services/             # Core business logic & database transactions
│   │   ├── utils/                # Standard API response wrappers & CMP number generator
│   │   ├── validators/           # Zod schema validation rules
│   │   └── server.ts             # Express server entrypoint
│   ├── uploads/                  # Local file upload directory
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── public/                   # Favicon and static assets
│   ├── src/
│   │   ├── components/           # Reusable UI library (Button, Input, Select, Modal, StatusBadge, etc.)
│   │   ├── context/              # AuthContext & ToastContext
│   │   ├── layouts/              # PublicLayout, StudentLayout, AdminLayout, Navbar, Sidebar
│   │   ├── pages/                # Student pages, Admin pages, Auth pages, Landing page
│   │   ├── services/             # Frontend API client and service endpoints
│   │   ├── types/                # TypeScript models and interfaces
│   │   ├── App.tsx               # Master router architecture
│   │   ├── index.css             # Tailwind base & custom design tokens
│   │   └── main.tsx              # React DOM root
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
├── spec.md                       # Master development specification
├── package.json                  # Root runner script
└── README.md                     # Documentation
```

---

## ⚡ Step-by-Step Installation & Local Execution

### 1. Prerequisites
- Node.js (v18+)
- npm (v9+)

### 2. Backend Setup
```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npx ts-node prisma/seed.ts
npm run dev
```
*The backend API server will start on `http://localhost:5000`.*

### 3. Frontend Setup
In a new terminal:
```bash
cd frontend
npm install
npm run dev
```
*The frontend portal will launch on `http://localhost:5173` with automatic API proxying.*

---

## 📚 Complete REST API Documentation

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new student account with student ID, department, course, year, semester.
- `POST /api/auth/login` — Sign in with email & password; returns JWT token and user profile.
- `GET /api/auth/me` — Retrieve currently logged-in user profile (Bearer token required).
- `PUT /api/auth/profile` — Update student contact and academic preferences.
- `POST /api/auth/logout` — Invalidate user session.

### Complaints (`/api/complaints`)
- `POST /api/complaints` — Submit a new grievance ticket with optional photo evidence. Generates sequential `CMP-XXXX` ID.
- `GET /api/complaints` — List complaints with search, category, priority, status, department filters, and pagination.
- `GET /api/complaints/:id` — Detailed complaint view with full chronological audit timeline and attachments.
- `PATCH /api/complaints/:id/status` — *(Admin)* Transition complaint lifecycle status.
- `PATCH /api/complaints/:id/priority` — *(Admin)* Update urgency level (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`).
- `POST /api/complaints/:id/assign` — *(Admin)* Assign responsible campus department and designated staff member.
- `POST /api/complaints/:id/resolve` — *(Admin)* Record official resolution details and notify the student.
- `POST /api/complaints/:id/close` — *(Student/Admin)* Confirm resolution satisfaction and close ticket.
- `POST /api/complaints/:id/updates` — Post comment or message to the ticket timeline.
- `POST /api/complaints/:id/attachments` — Upload additional photo evidence.

### Departments & Staff (`/api/departments`, `/api/staff`)
- `GET /api/departments` — List all campus departments with staff counts and active ticket counts.
- `POST /api/departments` — *(Admin)* Create a new campus department.
- `PUT /api/departments/:id` — *(Admin)* Edit department information.
- `DELETE /api/departments/:id` — *(Admin)* Remove department with dependency safety check.
- `GET /api/staff` — List staff directory (filterable by department).
- `POST /api/staff` — *(Admin)* Add a new specialist staff member.
- `PUT /api/staff/:id` — *(Admin)* Update staff details.
- `DELETE /api/staff/:id` — *(Admin)* Remove staff member.

### Dashboard & Analytics (`/api/dashboard`)
- `GET /api/dashboard/student` — Student KPI metrics (Total, Submitted, In Progress, Resolved, Closed) and recent complaints.
- `GET /api/dashboard/admin` — Admin analytics (Incident counts by status, category, priority, department workload, and recent activity).

### File Uploads (`/api/upload`)
- `POST /api/upload` — Upload multipart file (up to 5MB, JPG/PNG/WEBP/PDF). Returns accessible URL.

---

## 🧪 Production Build

To produce optimized production bundles:
```bash
# Build Backend
cd backend && npm run build

# Build Frontend
cd frontend && npm run build
```
