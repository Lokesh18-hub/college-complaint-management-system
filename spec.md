# College Complaint Management System

## AntiGravity Master Development Specification

---

# 1. ROLE

You are a senior full-stack software engineer and product designer.

Build a complete, production-quality **College Complaint Management System** from scratch according to this specification.

Do not build only a frontend prototype.

The application must have:

* Functional frontend
* Functional backend
* Real database
* Authentication
* Role-based authorization
* REST API
* File uploads
* Complete complaint lifecycle
* Admin management
* Responsive UI
* Validation
* Error handling
* Seed/demo data
* Deployment-ready configuration

Prioritize working functionality over unnecessary advanced features.

---

# 2. PRODUCT NAME

**College Complaint Management System**

Short name:

**CCMS**

---

# 3. CORE OBJECTIVE

Create a centralized digital platform where college students can report campus problems and track their resolution.

The system replaces manual complaint registers/forms.

Main workflow:

```text
Student
  ↓
Submit Complaint
  ↓
Admin Reviews
  ↓
Assign Department
  ↓
Assign Staff
  ↓
In Progress
  ↓
Resolved
  ↓
Student Reviews
  ↓
Closed
```

---

# 4. REQUIRED TECHNOLOGY STACK

Use the following stack unless there is a strong technical reason to change it.

## Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* React Router
* React Hook Form
* Zod
* TanStack Query
* Lucide React
* Recharts

## Backend

* Node.js
* Express.js
* TypeScript
* Zod
* JWT authentication
* bcrypt

## Database

Use:

* PostgreSQL
* Prisma ORM

## File Storage

Use Cloudinary if credentials are available.

Otherwise:

* Implement a clean storage abstraction.
* Support local development uploads.
* Do not make file storage tightly coupled to the application.

## Deployment

Frontend:

* Vercel

Backend:

* Render / Railway

Database:

* Supabase PostgreSQL / Neon PostgreSQL

---

# 5. ARCHITECTURE

Use a monorepo structure.

```text
ccms/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── features/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── lib/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── routes/
│   │   └── main.tsx
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── validators/
│   │   ├── utils/
│   │   ├── types/
│   │   ├── prisma/
│   │   └── server.ts
│   │
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   │
│   └── package.json
│
├── README.md
├── .env.example
├── .gitignore
└── package.json
```

Keep business logic out of route files.

Use:

```text
Routes
 ↓
Controllers
 ↓
Services
 ↓
Prisma
 ↓
Database
```

---

# 6. USER ROLES

Implement exactly two primary roles.

```ts
STUDENT
ADMIN
```

Use role-based middleware.

Example:

```text
requireAuth
requireRole(STUDENT)
requireRole(ADMIN)
```

---

# 7. AUTHENTICATION

Use JWT authentication.

Store password hashes using bcrypt.

Never store plaintext passwords.

## Register Endpoint

```http
POST /api/auth/register
```

Request:

```json
{
  "name": "Rahul Sharma",
  "studentId": "STU2026001",
  "email": "rahul@student.college.edu",
  "phone": "9876543210",
  "department": "Computer Science",
  "course": "B.Tech CSE",
  "year": 2,
  "semester": 3,
  "password": "password123"
}
```

Response:

```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {}
  }
}
```

---

# 8. LOGIN

```http
POST /api/auth/login
```

Request:

```json
{
  "email": "rahul@student.college.edu",
  "password": "password123"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "token": "JWT_TOKEN",
    "user": {}
  }
}
```

Frontend should maintain authenticated state.

---

# 9. AUTHENTICATION RULES

Unauthenticated users:

```text
/login
/register
```

Students:

```text
/student/*
```

Admins:

```text
/admin/*
```

If a student attempts to access:

```text
/admin/*
```

return:

```text
403 Forbidden
```

If a user is not authenticated:

```text
401 Unauthorized
```

---

# 10. DATABASE SCHEMA

Use Prisma.

## User

```text
User
- id
- name
- studentId
- email
- phone
- department
- course
- year
- semester
- passwordHash
- role
- createdAt
- updatedAt
```

Constraints:

```text
id          primary key
studentId   unique
email       unique
role        enum
```

---

# 11. DEPARTMENT MODEL

```text
Department
- id
- name
- description
- createdAt
- updatedAt
```

Default departments:

```text
IT Department
Maintenance
Electrical
Plumbing
Hostel Administration
Transport
Housekeeping
Library
Security
Student Affairs
```

---

# 12. STAFF MODEL

```text
Staff
- id
- name
- email
- phone
- departmentId
- createdAt
- updatedAt
```

Relationship:

```text
Department
    ↓
has many
    ↓
Staff
```

---

# 13. COMPLAINT MODEL

Create:

```text
Complaint
```

Fields:

```text
id
complaintNumber
studentId
title
category
description
location
priority
status
departmentId
assignedStaffId
resolutionDetails
resolvedBy
createdAt
updatedAt
resolvedAt
closedAt
```

Enums:

```text
ComplaintStatus

SUBMITTED
UNDER_REVIEW
ASSIGNED
IN_PROGRESS
RESOLVED
CLOSED
```

Priority:

```text
LOW
MEDIUM
HIGH
CRITICAL
```

---

# 14. COMPLAINT NUMBER

Generate a human-readable complaint number.

Format:

```text
CMP-0001
CMP-0002
CMP-0003
```

It must be unique.

Do not use this as the database primary key.

---

# 15. COMPLAINT UPDATE MODEL

Create:

```text
ComplaintUpdate
```

Fields:

```text
id
complaintId
userId
comment
status
createdAt
```

Every important complaint activity should create an update.

Examples:

```text
Complaint submitted
Status changed
Priority changed
Department assigned
Staff assigned
Admin comment added
Resolution added
Complaint closed
```

---

# 16. ATTACHMENT MODEL

Create:

```text
Attachment
```

Fields:

```text
id
complaintId
fileName
fileUrl
fileType
fileSize
createdAt
```

Allowed:

```text
jpg
jpeg
png
pdf
```

Maximum size:

```text
5 MB
```

Validate both MIME type and extension.

---

# 17. OPTIONAL NOTIFICATION MODEL

Prepare architecture for notifications.

```text
Notification
- id
- userId
- title
- message
- type
- read
- createdAt
```

Implement only after the core system works.

---

# 18. COMPLAINT CATEGORIES

Create a centralized category list.

```text
Classroom
Laboratory
Wi-Fi / Internet
Hostel
Infrastructure
Electrical
Plumbing
Transportation
Cleanliness
Library
Security
Cafeteria
Sports Facilities
Other
```

Prefer an enum/configuration rather than duplicating category strings throughout the application.

---

# 19. COMPLAINT STATUS FLOW

Implement:

```text
SUBMITTED
    ↓
UNDER_REVIEW
    ↓
ASSIGNED
    ↓
IN_PROGRESS
    ↓
RESOLVED
    ↓
CLOSED
```

Prevent invalid transitions.

For example:

```text
CLOSED → IN_PROGRESS
```

should not be allowed through normal UI/API operations.

Admin may move:

```text
SUBMITTED → UNDER_REVIEW
UNDER_REVIEW → ASSIGNED
ASSIGNED → IN_PROGRESS
IN_PROGRESS → RESOLVED
```

Student may:

```text
RESOLVED → CLOSED
```

---

# 20. STUDENT FEATURES

Student must be able to:

1. Register.
2. Login.
3. Logout.
4. View dashboard.
5. Submit complaint.
6. Upload attachment.
7. View own complaints.
8. Search own complaints.
9. Filter own complaints.
10. Open complaint details.
11. View timeline.
12. View assigned department.
13. View assigned staff.
14. View admin updates.
15. View resolution.
16. Close resolved complaint.
17. View profile.

---

# 21. STUDENT DASHBOARD

Route:

```text
/student/dashboard
```

Display:

```text
Total Complaints
Submitted
Under Review
Assigned
In Progress
Resolved
Closed
```

Add:

```text
Recent Complaints
```

and:

```text
Submit New Complaint
```

CTA.

---

# 22. STUDENT COMPLAINT PAGE

Route:

```text
/student/complaints
```

Provide:

* Search
* Status filter
* Priority filter
* Category filter
* Pagination

Each complaint should display:

```text
Complaint ID
Title
Category
Priority
Status
Created Date
Last Updated
View Details
```

---

# 23. COMPLAINT SUBMISSION PAGE

Route:

```text
/student/complaints/new
```

Form fields:

```text
Complaint Title
Category
Description
Location
Priority
Attachment
```

Required:

```text
title
category
description
location
priority
```

Attachment optional.

Show upload progress where applicable.

After successful submission:

```text
✓ Complaint submitted successfully
Complaint ID: CMP-0001
```

Then provide:

```text
View Complaint
```

---

# 24. STUDENT COMPLAINT DETAILS

Route:

```text
/student/complaints/:id
```

Display:

### Header

```text
CMP-0001
Wi-Fi not working in Computer Lab
```

### Metadata

```text
Category
Priority
Location
Created
Last Updated
Current Status
```

### Timeline

Display chronological activity.

### Resolution

Display only when resolution exists.

### Close Complaint

Show only when:

```text
status === RESOLVED
```

---

# 25. ADMIN DASHBOARD

Route:

```text
/admin/dashboard
```

Display:

```text
Total Complaints
New Complaints
Under Review
Assigned
In Progress
Resolved
Closed
Critical
```

Do not hardcode values.

Fetch statistics from backend.

---

# 26. ADMIN COMPLAINT MANAGEMENT

Route:

```text
/admin/complaints
```

Features:

* Search
* Status filter
* Priority filter
* Category filter
* Department filter
* Date filter
* Sorting
* Pagination

Table columns:

```text
Complaint ID
Student
Title
Category
Priority
Status
Department
Created
Actions
```

---

# 27. ADMIN COMPLAINT DETAILS

Route:

```text
/admin/complaints/:id
```

Display:

### Complaint

```text
Complaint ID
Title
Category
Description
Location
Priority
Attachment
Created Date
```

### Student

```text
Name
Student ID
Email
Phone
Department
Course
Year
```

### Assignment

```text
Department
Staff
```

### Timeline

All updates.

### Admin Actions

```text
Change Status
Change Priority
Assign Department
Assign Staff
Add Comment
Resolve Complaint
```

---

# 28. ASSIGNMENT WORKFLOW

Admin selects:

```text
Department
```

After department selection:

```text
Load staff belonging to selected department
```

Then:

```text
Select Staff
```

Save assignment.

Create activity:

```text
Complaint assigned to IT Department
Assigned staff: Rahul Kumar
```

Status should become:

```text
ASSIGNED
```

---

# 29. STATUS UPDATE

Endpoint:

```http
PATCH /api/complaints/:id/status
```

Request:

```json
{
  "status": "IN_PROGRESS"
}
```

Backend must:

1. Authenticate user.
2. Verify admin role.
3. Validate transition.
4. Update complaint.
5. Create ComplaintUpdate.
6. Return updated complaint.

---

# 30. PRIORITY UPDATE

Endpoint:

```http
PATCH /api/complaints/:id/priority
```

Request:

```json
{
  "priority": "HIGH"
}
```

Create an activity record.

---

# 31. ADMIN COMMENT

Endpoint:

```http
POST /api/complaints/:id/updates
```

Request:

```json
{
  "comment": "Technician has been assigned to inspect the router."
}
```

Store:

```text
comment
admin
timestamp
```

---

# 32. RESOLUTION

Endpoint:

```http
PATCH /api/complaints/:id/resolve
```

Request:

```json
{
  "resolutionDetails": "The faulty router was replaced and connectivity has been restored."
}
```

Backend must:

```text
Set resolutionDetails
Set resolvedBy
Set resolvedAt
Set status = RESOLVED
Create timeline update
```

---

# 33. CLOSE COMPLAINT

Endpoint:

```http
PATCH /api/complaints/:id/close
```

Only the student who created the complaint can close it.

Requirements:

```text
Current status must be RESOLVED
Authenticated user must be complaint owner
```

Then:

```text
status = CLOSED
closedAt = current timestamp
```

Create timeline activity.

---

# 34. API STRUCTURE

Use:

```text
/api/auth
/api/users
/api/complaints
/api/departments
/api/staff
/api/dashboard
```

---

# 35. REQUIRED API ENDPOINTS

## Authentication

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/logout
```

## Complaints

```http
GET    /api/complaints
POST   /api/complaints
GET    /api/complaints/:id
PATCH  /api/complaints/:id
DELETE /api/complaints/:id
```

## Complaint status

```http
PATCH /api/complaints/:id/status
```

## Priority

```http
PATCH /api/complaints/:id/priority
```

## Assignment

```http
PATCH /api/complaints/:id/assign
```

## Updates

```http
GET  /api/complaints/:id/updates
POST /api/complaints/:id/updates
```

## Resolution

```http
PATCH /api/complaints/:id/resolve
```

## Closing

```http
PATCH /api/complaints/:id/close
```

## Departments

```http
GET    /api/departments
POST   /api/departments
PATCH  /api/departments/:id
DELETE /api/departments/:id
```

## Staff

```http
GET    /api/staff
POST   /api/staff
PATCH  /api/staff/:id
DELETE /api/staff/:id
```

## Dashboard

```http
GET /api/dashboard/student
GET /api/dashboard/admin
```

---

# 36. API RESPONSE FORMAT

Use consistent responses.

Success:

```json
{
  "success": true,
  "message": "Complaint created successfully",
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Unable to create complaint",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": {}
  }
}
```

---

# 37. PAGINATION

Complaint endpoints must support pagination.

Example:

```http
GET /api/complaints?page=1&limit=10
```

Response:

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

Default:

```text
page = 1
limit = 10
```

Maximum:

```text
limit = 50
```

---

# 38. SEARCH

Support:

```http
GET /api/complaints?search=wifi
```

Search fields:

```text
complaintNumber
title
location
category
```

---

# 39. FILTERING

Support query parameters:

```text
status
priority
category
departmentId
assignedStaffId
```

Example:

```http
GET /api/complaints?status=IN_PROGRESS&priority=HIGH
```

---

# 40. SORTING

Support:

```text
sortBy
sortOrder
```

Example:

```http
GET /api/complaints?sortBy=createdAt&sortOrder=desc
```

Whitelist sortable fields.

Do not directly inject query parameters into database queries.

---

# 41. FILE UPLOAD API

Endpoint:

```http
POST /api/complaints/:id/attachments
```

Use multipart/form-data.

Validate:

```text
Maximum size: 5MB
Allowed:
image/jpeg
image/png
application/pdf
```

Return:

```json
{
  "success": true,
  "data": {
    "fileName": "wifi-problem.jpg",
    "fileUrl": "..."
  }
}
```

---

# 42. FRONTEND ROUTING

Implement protected routing.

```text
/
 /login
 /register

/student/dashboard
/student/complaints
/student/complaints/new
/student/complaints/:id
/student/profile

/admin/dashboard
/admin/complaints
/admin/complaints/:id
/admin/departments
/admin/staff
/admin/analytics
/admin/settings
```

---

# 43. LAYOUTS

Create:

```text
PublicLayout
StudentLayout
AdminLayout
```

Student layout:

```text
Sidebar
Topbar
Main Content
```

Admin layout:

```text
Sidebar
Topbar
Main Content
```

Mobile sidebar should become a drawer.

---

# 44. REQUIRED COMPONENTS

Create reusable components.

```text
Button
Input
Textarea
Select
Modal
Dialog
Dropdown
Badge
StatusBadge
PriorityBadge
Card
DataTable
Pagination
SearchInput
FilterPanel
FileUploader
Toast
LoadingSpinner
Skeleton
EmptyState
ErrorState
Sidebar
Topbar
NotificationBell
ComplaintCard
ComplaintTimeline
ComplaintForm
StatsCard
```

Do not duplicate UI logic unnecessarily.

---

# 45. DESIGN SYSTEM

Use a professional SaaS-style interface.

Design principles:

```text
Minimal
Clean
Modern
Professional
Accessible
Responsive
```

Avoid:

```text
Excessive gradients
Overly flashy animations
Heavy glassmorphism
Clutter
Unnecessary decorative effects
```

Use subtle transitions.

---

# 46. COLOR SYSTEM

Use a neutral professional interface.

Suggested:

```text
Background: off-white / very light gray
Surface: white
Text: dark charcoal
Primary: deep blue / indigo
Success: green
Warning: amber
Danger: red
```

Do not overuse colors.

Status colors should communicate meaning.

---

# 47. STATUS BADGES

Use:

```text
Submitted      → neutral
Under Review   → informational
Assigned       → purple/indigo
In Progress    → blue
Resolved       → green
Closed         → dark/neutral
```

Priority:

```text
Low       → neutral
Medium    → blue
High      → orange
Critical  → red
```

---

# 48. RESPONSIVE DESIGN

Must support:

```text
320px+
768px+
1024px+
1440px+
```

Mobile:

* Drawer sidebar
* Stacked dashboard cards
* Responsive forms
* Complaint cards instead of wide tables where necessary
* Touch-friendly controls

---

# 49. DASHBOARD CHARTS

Use Recharts.

Implement:

### Complaints by Status

Bar or donut chart.

### Complaints by Category

Bar chart.

### Complaints by Priority

Chart.

Charts must use live database statistics.

Never hardcode chart values.

---

# 50. DASHBOARD KPI CALCULATIONS

Backend should calculate:

```text
total
submitted
underReview
assigned
inProgress
resolved
closed
critical
```

Also:

```text
categoryDistribution
priorityDistribution
statusDistribution
```

---

# 51. SECURITY

Implement:

* bcrypt password hashing
* JWT authentication
* Authentication middleware
* Role authorization
* Input validation
* File validation
* CORS configuration
* Rate limiting
* Secure HTTP headers
* Environment variables
* Centralized error handling

Never expose:

```text
passwordHash
JWT secret
database credentials
API secrets
```

in frontend responses.

---

# 52. OWNERSHIP SECURITY

Students can:

```text
GET their own complaints
POST complaints
GET their own complaint details
CLOSE their own resolved complaints
```

Students cannot:

```text
View another student's complaint
Modify another student's complaint
Change status
Assign department
Assign staff
Add admin updates
Resolve complaint
```

Admins can manage all complaints.

---

# 53. VALIDATION

Use Zod.

Validate on both:

```text
Frontend
Backend
```

Complaint validation:

```text
title:
  required
  min 5 characters
  max 150 characters

description:
  required
  min 10 characters
  max 5000 characters

location:
  required
  max 200 characters

category:
  required

priority:
  required
```

---

# 54. ERROR HANDLING

Create centralized backend error middleware.

Handle:

```text
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Validation Error
429 Too Many Requests
500 Internal Server Error
```

Frontend should display friendly messages.

Never show raw stack traces to users.

---

# 55. LOADING STATES

Every asynchronous operation should have loading state.

Examples:

```text
Submitting complaint...
Loading complaints...
Updating status...
Assigning staff...
Resolving complaint...
```

Use skeleton loaders for dashboards/tables where appropriate.

---

# 56. EMPTY STATES

Example student:

```text
No complaints yet.

You haven't submitted any complaints.

[ Submit Complaint ]
```

Admin:

```text
No complaints found.

Try changing your search or filters.
```

---

# 57. TOAST NOTIFICATIONS

Success examples:

```text
Complaint submitted successfully.
Complaint assigned successfully.
Status updated successfully.
Resolution added successfully.
Complaint closed successfully.
```

Error examples:

```text
Something went wrong.
Unable to update complaint.
File upload failed.
```

---

# 58. AUDIT TIMELINE

Every complaint should have a visible timeline.

Example:

```text
29 Aug 2026 • 10:30 AM
Complaint submitted by Rahul Sharma

29 Aug 2026 • 11:00 AM
Status changed to Under Review

29 Aug 2026 • 11:30 AM
Assigned to IT Department

29 Aug 2026 • 12:15 PM
Assigned to Rahul Kumar

29 Aug 2026 • 02:00 PM
Status changed to In Progress

30 Aug 2026 • 10:00 AM
Resolution added

30 Aug 2026 • 10:01 AM
Status changed to Resolved
```

---

# 59. PROFILE PAGE

Student profile:

```text
Name
Student ID
Email
Phone
Department
Course
Year
Semester
```

Allow editing safe profile fields.

Do not allow users to change their own role.

---

# 60. ADMIN DEPARTMENT MANAGEMENT

Route:

```text
/admin/departments
```

Admin can:

```text
Create department
View departments
Edit department
Delete department
```

Do not allow deletion if active complaints depend on that department unless reassignment is handled.

---

# 61. ADMIN STAFF MANAGEMENT

Route:

```text
/admin/staff
```

Admin can:

```text
Create staff
View staff
Edit staff
Delete staff
Filter by department
```

Staff must belong to a department.

---

# 62. SEED DATA

Create Prisma seed script.

Seed:

## Admin

```text
Name:
System Administrator

Email:
admin@college.edu

Role:
ADMIN
```

## Students

Create at least:

```text
5 demo students
```

## Departments

Create all default departments.

## Staff

Create at least:

```text
2 IT staff
2 Maintenance staff
2 Hostel staff
2 Electrical staff
```

## Complaints

Create at least:

```text
15 demo complaints
```

Use different:

```text
statuses
priorities
categories
departments
students
```

This should populate the dashboards.

---

# 63. DEMO CREDENTIALS

Document seed credentials in README.

Example:

```text
Admin:
admin@college.edu
Admin@123

Student:
student@college.edu
Student@123
```

Do not use these credentials in production.

---

# 64. ENVIRONMENT VARIABLES

Create:

```text
.env.example
```

Example:

```env
DATABASE_URL=

JWT_SECRET=
JWT_EXPIRES_IN=7d

PORT=5000

FRONTEND_URL=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

# 65. FRONTEND API CONFIGURATION

Do not hardcode:

```text
http://localhost:5000
```

throughout the frontend.

Use:

```env
VITE_API_URL=
```

and a centralized API client.

---

# 66. API CLIENT

Create:

```text
frontend/src/services/api.ts
```

Use one centralized HTTP client.

It should handle:

* Base URL
* Authentication token
* JSON headers
* Error responses

Create service modules:

```text
authService
complaintService
departmentService
staffService
dashboardService
```

---

# 67. STATE MANAGEMENT

Use TanStack Query for server state.

Use React state/context only for:

```text
authentication UI state
sidebar state
small local UI state
```

Avoid unnecessary global state.

---

# 68. FORM MANAGEMENT

Use:

```text
React Hook Form
+
Zod
```

for:

```text
Login
Register
Complaint submission
Department creation
Staff creation
Admin updates
```

---

# 69. ACCESSIBILITY

Implement:

* Semantic HTML
* Form labels
* Keyboard navigation
* Focus states
* Accessible dialogs
* Accessible dropdowns
* Sufficient contrast
* Alt text
* Error messages connected to fields

---

# 70. PERFORMANCE

Implement:

* Pagination
* Lazy loading where useful
* Optimized images
* Database indexes
* Efficient Prisma queries
* TanStack Query caching
* Avoid unnecessary API requests

Add indexes for frequently queried fields:

```text
complaintNumber
studentId
status
priority
category
departmentId
createdAt
```

---

# 71. API DOCUMENTATION

Create:

```text
README.md
```

with API endpoint documentation.

For each endpoint document:

```text
Method
Endpoint
Authentication
Request body
Query parameters
Response
Possible errors
```

---

# 72. README

README must contain:

```text
Project Overview
Features
Tech Stack
Architecture
Folder Structure
Database Setup
Environment Variables
Installation
Development
Seed Data
Demo Credentials
API Documentation
Deployment
Troubleshooting
```

---

# 73. DEVELOPMENT COMMANDS

Root:

```bash
npm install
```

Frontend:

```bash
npm run dev
```

Backend:

```bash
npm run dev
```

Database:

```bash
npx prisma migrate dev
npx prisma db seed
```

Production:

```bash
npm run build
npm start
```

Ensure the actual package scripts match the commands documented in README.

---

# 74. TESTING REQUIREMENTS

Test the following.

## Authentication

```text
Register
Login
Logout
Invalid login
Protected routes
Role protection
```

## Student

```text
Submit complaint
Upload file
View complaint
Search
Filter
View timeline
View resolution
Close complaint
```

## Admin

```text
View all complaints
Search
Filter
Assign department
Assign staff
Change priority
Change status
Add update
Resolve complaint
View analytics
Manage departments
Manage staff
```

## Security

Verify:

```text
Student cannot access admin routes.
Student cannot access another student's complaint.
Student cannot resolve complaints.
Student cannot change priority.
Student cannot assign staff.
```

---

# 75. CORE IMPLEMENTATION ORDER

Do not attempt to build everything simultaneously.

Follow this order.

## STEP 1 — Project Setup

Create:

```text
frontend
backend
Prisma
PostgreSQL connection
environment configuration
```

Confirm both applications run.

---

## STEP 2 — Database

Implement:

```text
User
Department
Staff
Complaint
ComplaintUpdate
Attachment
```

Run migrations.

Create seed script.

Verify database.

---

## STEP 3 — Authentication

Implement:

```text
Register
Login
JWT
/me
Logout
Role middleware
Protected routes
```

Test student/admin access.

---

## STEP 4 — Complaint Backend

Implement:

```text
Create complaint
Get complaints
Get complaint
Update complaint
Delete complaint
Search
Filter
Pagination
```

Test APIs.

---

## STEP 5 — Complaint Lifecycle

Implement:

```text
Status updates
Priority
Assignment
Comments
Resolution
Closing
Timeline
```

Test complete workflow.

---

## STEP 6 — Student Frontend

Build:

```text
Login
Register
Dashboard
Complaint form
Complaint list
Complaint details
Profile
```

Connect everything to real APIs.

---

## STEP 7 — Admin Frontend

Build:

```text
Admin dashboard
Complaint management
Complaint details
Departments
Staff
Analytics
```

Connect to APIs.

---

## STEP 8 — File Upload

Implement:

```text
Upload
Validation
Preview
Storage
Download/view
```

---

## STEP 9 — UI Polish

Improve:

```text
Responsive layout
Loading states
Empty states
Error states
Toasts
Animations
Accessibility
```

---

## STEP 10 — Testing

Test the complete application.

Fix all major bugs.

---

## STEP 11 — Deployment

Prepare:

```text
Frontend deployment
Backend deployment
Database deployment
Environment variables
CORS
Production build
```

Verify the production workflow.

---

# 76. OPTIONAL FEATURES

Only implement these after all core functionality is stable.

Priority order:

```text
1. Notifications
2. Email notifications
3. Analytics improvements
4. Resolution rating
5. Complaint resolution time
6. Automatic escalation
7. Duplicate detection
8. AI categorization
9. AI summaries
10. Image classification
11. PWA
```

Never let optional features break the core system.

---

# 77. AI FEATURES

If implementing AI, isolate AI logic inside:

```text
backend/src/services/ai/
```

Do not mix AI logic into controllers.

Possible functions:

```text
categorizeComplaint()
suggestPriority()
suggestDepartment()
summarizeComplaint()
detectDuplicateComplaint()
```

AI suggestions must never automatically override admin decisions.

---

# 78. RESOLUTION RATING

Optional.

After:

```text
RESOLVED
```

student can submit:

```text
rating: 1–5
feedback
```

Only allow one rating per complaint.

---

# 79. SLA / ESCALATION

Optional.

Suggested thresholds:

```text
Critical → 12 hours
High     → 48 hours
Medium   → 72 hours
Low      → 7 days
```

Flag overdue complaints.

Do not automatically change complaint status unless explicitly configured.

---

# 80. FINAL QUALITY REQUIREMENTS

Before considering the project complete, verify:

### Functionality

```text
[ ] Registration works
[ ] Login works
[ ] Logout works
[ ] Student dashboard works
[ ] Complaint submission works
[ ] Database stores complaints
[ ] File upload works
[ ] Complaint history works
[ ] Complaint details works
[ ] Admin dashboard works
[ ] Admin can assign department
[ ] Admin can assign staff
[ ] Admin can update status
[ ] Admin can add comments
[ ] Admin can resolve complaint
[ ] Student can close resolved complaint
[ ] Search works
[ ] Filters work
[ ] Pagination works
[ ] Analytics use real data
```

### Security

```text
[ ] Passwords hashed
[ ] JWT authentication
[ ] Protected routes
[ ] Role authorization
[ ] Ownership checks
[ ] Input validation
[ ] File validation
[ ] Secrets in environment variables
```

### UX

```text
[ ] Responsive
[ ] Mobile friendly
[ ] Loading states
[ ] Empty states
[ ] Error states
[ ] Toast messages
[ ] Accessible forms
[ ] Consistent UI
```

---

# 81. DEFINITION OF DONE

The application is DONE only when this exact flow works:

```text
Student registers
       ↓
Student logs in
       ↓
Student opens dashboard
       ↓
Student submits complaint
       ↓
Complaint is stored in PostgreSQL
       ↓
Complaint receives CMP-XXXX ID
       ↓
Admin logs in
       ↓
Admin sees complaint
       ↓
Admin reviews complaint
       ↓
Admin assigns department
       ↓
Admin assigns staff
       ↓
Status = ASSIGNED
       ↓
Admin changes status
       ↓
Status = IN_PROGRESS
       ↓
Admin adds update
       ↓
Admin resolves complaint
       ↓
Status = RESOLVED
       ↓
Resolution is visible to student
       ↓
Student confirms resolution
       ↓
Status = CLOSED
       ↓
Complete timeline remains available
```

---

# 82. IMPORTANT AGENT RULES

Follow these rules throughout development:

1. Do not create fake frontend-only functionality.
2. Do not hardcode dashboard statistics.
3. Do not hardcode complaint lists.
4. Use PostgreSQL for persistent data.
5. Use Prisma for database access.
6. Do not store plaintext passwords.
7. Never expose secrets to the frontend.
8. Do not bypass authorization.
9. Students can only access their own complaints.
10. Admins can access all complaints.
11. Validate all user input.
12. Validate uploads.
13. Use reusable components.
14. Keep backend business logic in services.
15. Keep API responses consistent.
16. Use proper HTTP status codes.
17. Add loading and error states.
18. Do not add unnecessary dependencies.
19. Do not implement bonus features before core features.
20. Test each feature before moving to the next phase.
21. Do not leave TODO placeholders for core functionality.
22. Do not declare the project complete while core workflow is broken.
23. If a technical decision is necessary, choose the simplest production-safe solution.
24. Keep the application easy to maintain.
25. The final result must be deployable.

---

# 83. FINAL DELIVERABLE

The final repository must contain:

```text
Complete React frontend
Complete Node/Express backend
Prisma schema
Database migrations
Seed data
Authentication
Role-based authorization
Complaint management
File upload
Admin dashboard
Student dashboard
Analytics
Responsive UI
API documentation
README
.env.example
Production build configuration
```

The final result should look and behave like a real **College Complaint Management Platform**, not a basic CRUD demonstration.
