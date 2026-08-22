# Habit Tracker with Streaks

A full-stack habit tracking application built for the **Burdenoff Product Engineering Intern — Full Stack** take-home assignment.

The application allows users to create habits, check in once per local calendar day, and track streaks using the user's assigned **IANA timezone** rather than elapsed UTC hours.

The main engineering challenge of this project is treating a habit check-in as a **calendar-day event**, not simply a timestamp.

---

## Overview

Habit Tracker is designed around one core rule:

> **A streak is based on the user's local calendar days, not elapsed hours.**

For example, a user in `Asia/Kolkata` can have:

```text
2026-03-10 local day
2026-03-11 local day
2026-03-12 local day
```

These represent three consecutive habit days regardless of the exact UTC timestamps at which the check-ins were created.

The backend owns all streak calculations and local-day decisions. The React frontend only displays the values returned by the API.

---

## Key Features

### Authentication

* User registration
* User login
* JWT-based authentication
* Protected habit and check-in APIs
* Secure password hashing with `bcryptjs`
* User-specific data isolation
* IANA timezone stored with each user

Example:

```text
Email: user@example.com
Timezone: Asia/Kolkata
```

### Habit Management

* Create habits
* View authenticated user's habits
* View individual habits
* Optional habit descriptions
* Ownership validation on protected resources

### Daily Check-ins

* One check-in per habit per local day
* One-click check-in for today
* Duplicate check-in protection
* Check-in history
* Check-in deletion
* Database-level uniqueness constraint for:

```text
habitId + localDay
```

### Streak Tracking

The backend calculates:

* Current streak
* Longest streak
* Total check-ins
* Whether the habit was completed today

The frontend does **not** calculate streaks.

This keeps business logic centralized on the server and prevents client-side manipulation of streak values.

---

## Tech Stack

### Frontend

* React
* Vite
* JavaScript / JSX
* CSS3
* Responsive design
* Fetch API
* Component-based architecture

### Backend

* Node.js
* Express.js
* REST API
* JWT
* bcryptjs
* Luxon

### Database

* PostgreSQL
* Prisma ORM

### Development Tools

* Git
* GitHub
* npm
* ESLint
* VS Code
* Browser Developer Tools

---

## Architecture

The project follows a simple full-stack separation:

```text
habit-tracker/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuthForm.jsx
│   │   │   ├── HabitCard.jsx
│   │   │   ├── HabitList.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── StatsCard.jsx
│   │   │
│   │   ├── api.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   │
│   └── src/
│       ├── controllers/
│       │   ├── authController.js
│       │   ├── habitController.js
│       │   ├── checkInController.js
│       │   └── statsController.js
│       │
│       ├── middleware/
│       │   └── auth.js
│       │
│       ├── routes/
│       │   ├── authRoutes.js
│       │   ├── habitRoutes.js
│       │   └── checkInRoutes.js
│       │
│       ├── utils/
│       │   └── localDay.js
│       │
│       ├── lib/
│       │   └── prisma.js
│       │
│       └── server.js
│
├── .gitignore
└── README.md
```

The frontend is responsible for presentation and user interaction.

The backend is responsible for authentication, authorization, validation, persistence, local-day handling, and streak calculations.

---

# Timezone and Local-Day Design

This is the most important part of the application.

A timestamp alone is not sufficient to determine which habit day a check-in belongs to.

For example:

```text
UTC:
2026-03-11T21:30:00Z

Asia/Kolkata:
2026-03-12 03:00
```

The check-in belongs to the user's local day:

```text
2026-03-12
```

not:

```text
2026-03-11
```

Therefore the application stores both:

```text
occurredAt
localDay
```

### Why store both?

`occurredAt` represents the actual instant when the check-in was created.

`localDay` represents the calendar day that the check-in counts toward.

This separates:

```text
"When did this record happen?"
```

from:

```text
"Which habit day does this record represent?"
```

---

## Local-Day Representation

The database stores `localDay` as a date value representing the user's calendar date.

The backend converts the user's timezone-aware calendar day into a normalized database representation.

The important invariant is:

```text
One habit
+
One local calendar day
=
At most one check-in
```

This is also enforced by the database schema:

```prisma
@@unique([habitId, localDay])
```

That means duplicate check-ins cannot simply be prevented by the frontend.

The database itself protects the invariant.

---

# Streak Calculation

Streak calculations are performed server-side.

The backend first retrieves the user's timezone:

```text
User
 └── timezone
```

For example:

```text
Asia/Kolkata
```

The current local date is then calculated using that timezone.

The backend converts stored check-in dates into local calendar dates and compares consecutive dates.

Example:

```text
2026-03-10
2026-03-11
2026-03-12
```

produces:

```text
currentStreak = 3
longestStreak = 3
```

A missing calendar day breaks the sequence.

Example:

```text
2026-03-10
2026-03-11
2026-03-13
```

produces two streak sequences:

```text
2026-03-10 → 2026-03-11
2026-03-13
```

The longest streak is therefore:

```text
2
```

---

## Why the Frontend Does Not Calculate Streaks

The frontend receives values such as:

```json
{
  "currentStreak": 4,
  "longestStreak": 7,
  "totalCheckIns": 24,
  "completedToday": true
}
```

It does not determine whether a streak is alive.

This prevents differences between:

```text
Frontend timezone
Browser timezone
Server timezone
User timezone
```

from producing inconsistent results.

The server is the single source of truth.

---

# Database Model

The application uses PostgreSQL with Prisma.

## User

```text
User
├── id
├── email
├── passwordHash
├── timezone
└── createdAt
```

## Habit

```text
Habit
├── id
├── userId
├── name
├── description
├── createdAt
└── updatedAt
```

## CheckIn

```text
CheckIn
├── id
├── habitId
├── occurredAt
└── localDay
```

Relationships:

```text
User
 │
 └── Habit
      │
      └── CheckIn
```


---

# Database-Level Duplicate Protection

The most important database constraint is:

```prisma
@@unique([habitId, localDay])
```

This prevents:

```text
Habit A
2026-08-22
2026-08-22
```

from being stored twice.

The frontend therefore cannot accidentally create two valid check-ins for the same habit/day.

The backend also performs an existence check before attempting to create the record so that users receive a meaningful API error rather than a raw database error.

---

# Authentication

Authentication uses JWT.

Login flow:

```text
React
  │
  │ POST /api/auth/login
  ▼
Express
  │
  ├── Find user
  ├── Compare password using bcrypt
  └── Create JWT
  │
  ▼
React
  │
  └── Store token
```

Protected requests send:

```http
Authorization: Bearer <token>
```

The authentication middleware validates the token and exposes the authenticated user ID through:

```javascript
req.user.userId
```

Protected resources then verify ownership before accessing or modifying data.

---

# Password Security

Passwords are never stored directly.

During registration:

```text
Plain password
      ↓
bcrypt
      ↓
passwordHash
      ↓
PostgreSQL
```

During login:

```text
Entered password
      ↓
bcrypt.compare()
      ↓
Stored password hash
```

JWT secrets and database credentials are kept in environment variables rather than committed to Git.

---

# API Design

## Authentication

### Register

```http
POST /api/auth/register
```

Request:

```json
{
  "email": "user@example.com",
  "password": "password123",
  "timezone": "Asia/Kolkata"
}
```

### Login

```http
POST /api/auth/login
```

### Current User

```http
GET /api/auth/me
```

Requires authentication.

---

## Habits

### Create Habit

```http
POST /api/habits
```

### Get Habits

```http
GET /api/habits
```

### Get Habit

```http
GET /api/habits/:id
```
---

## Check-ins

### Check In

```http
POST /api/habits/:id/check-ins
```

### Check-in History

```http
GET /api/habits/:id/check-ins
```

### Remove Check-in

```http
DELETE /api/habits/:id/check-ins/:localDay
```

---

## Habit Statistics

```http
GET /api/habits/:id/stats
```

Example response:

```json
{
  "stats": {
    "currentStreak": 4,
    "longestStreak": 7,
    "totalCheckIns": 24,
    "completedToday": true
  }
}
```

---

# Validation and Error Handling

The backend validates important business rules instead of relying only on the frontend.

Examples include:

### Missing authentication

```http
401 Unauthorized
```

### Invalid or expired JWT

```http
401 Unauthorized
```

### Habit does not belong to user

```http
404 Not Found
```

### Invalid habit name

```http
400 Bad Request
```

### Duplicate check-in

```http
409 Conflict
```

The frontend displays API errors in the appropriate UI state rather than silently failing.

---

# Frontend Design

The frontend was intentionally kept component-based rather than putting the complete dashboard into a single component.

Important components include:

```text
AuthForm
HabitList
HabitCard
StatsCard
Navbar
```

The UI includes:

* Responsive dashboard
* Authentication screen
* Habit cards
* Streak statistics
* Completion state
* Loading states
* Error states
* Empty states
* Responsive layouts
* Modern visual styling
* Clear primary actions

The frontend communicates with the backend through a small API service layer:

```text
client/src/api.js
```

This keeps HTTP logic separate from presentation components.

---

# Environment Variables

Create a `.env` file inside the `server` directory.

Example:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/habit_tracker"
JWT_SECRET="replace-with-a-long-random-secret"
PORT=5001
```

Do not commit the `.env` file.

---

# Getting Started

## Prerequisites

Install:

* Node.js
* npm
* PostgreSQL
* Git

Recommended:

```text
Node.js 20+
PostgreSQL 14+
```

---

## 1. Clone the Repository

```bash
git clone https://github.com/Rufith7/habit-tracker.git
cd habit-tracker
```

---

## 2. Install Backend Dependencies

```bash
cd server
npm install
```

---

## 3. Configure Environment Variables

Create:

```text
server/.env
```

Example:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/habit_tracker"
JWT_SECRET="your-secret-key"
PORT=5001
```

---

## 4. Set Up the Database

Run Prisma migrations:

```bash
npx prisma migrate dev
```

Generate the Prisma client:

```bash
npx prisma generate
```

---

## 5. Start the Backend

From:

```text
server/
```

run:

```bash
npm run dev
```

The API should be available at:

```text
http://localhost:5001
```

Health check:

```text
GET http://localhost:5001/api/health
```

Expected response:

```json
{
  "message": "Habit Tracker API is running"
}
```

---

## 6. Install Frontend Dependencies

Open another terminal:

```bash
cd client
npm install
```

---

## 7. Start the Frontend

```bash
npm run dev
```

Vite will provide the local development URL.

Open it in the browser.

---

# Suggested Test Flow

A reviewer can verify the application with the following flow:

### 1. Register

Create an account with:

```text
Email: reviewer@example.com
Password: Password123
Timezone: Asia/Kolkata
```

### 2. Login

Log in using the created credentials.

### 3. Create a Habit

Example:

```text
Name: Morning Exercise
Description: 30 minutes
```

### 4. Check In

Click the check-in button.

### 5. Verify Statistics

The dashboard should update the relevant completion and streak values.

### 6. Test Duplicate Protection

Click check-in again for the same local day.

The backend should reject the duplicate rather than creating a second record.

### 7. Test History

Open the habit's check-in history and verify stored local-day records.

---

# Engineering Decisions

## Server-side business logic

The frontend does not decide:

* whether a check-in is valid
* whether a habit belongs to the user
* whether a streak continues
* whether a date belongs to the user's local day

Those decisions belong to the backend.

---

## Database constraints

Important business rules are reinforced at the database layer where possible.

The unique constraint:

```prisma
@@unique([habitId, localDay])
```

is particularly important because it protects against duplicate check-ins even if two requests reach the server concurrently.

---

## Ownership checks

Protected resources are always queried using the authenticated user's ID.

For example:

```text
habitId + userId
```

rather than simply:

```text
habitId
```

This prevents an authenticated user from accessing another user's habit by guessing its ID.

---

## Timezone isolation

Timezone handling is based on the timezone stored for the user.

The browser's timezone is not used to determine streaks.

This is important because a user could open the application from a different location without changing the timezone associated with their habit history.

---

# Git Practices

The project was developed using incremental Git commits rather than one large final commit.

Examples of meaningful commits include:

```text
chore: define habit tracking data model
feat: add authentication habits check-ins and stats
chore: initialize React frontend
feat: build habit dashboard UI
feat: integrate frontend authentication
feat: add habit creation and check-ins
feat: complete habit tracking functionality
feat: modernize habit tracker frontend
```

This history makes the development progression easier to review.

---

# Scope and Trade-offs

The implementation intentionally prioritizes the core engineering requirements over unnecessary features.

The focus areas are:

```text
Authentication
        ↓
Timezone-aware dates
        ↓
Habit ownership
        ↓
Check-in integrity
        ↓
Server-side streak calculation
        ↓
Database constraints
        ↓
Responsive frontend
```

The application does not introduce unnecessary state-management libraries or complex infrastructure where the existing React + Express architecture is sufficient.

---

# AI-Assisted Development

AI tools were used during development as an implementation aid.

The generated code was reviewed, tested, integrated, and debugged manually.

The important engineering decisions remain explicit in the codebase, particularly:

* timezone handling
* database modeling
* authentication
* ownership checks
* duplicate prevention
* streak calculation
* API boundaries

AI assistance was therefore used to accelerate implementation rather than replace understanding of the application logic.

---

# What I Would Improve Next

If this application were developed beyond the take-home scope, the next improvements would include:

* Automated backend tests for timezone edge cases
* Explicit backfill API and UI
* Future-date validation tests
* Habit creation-date validation for historical check-ins
* Integration tests for duplicate concurrent requests
* CI workflow for linting and tests
* Docker Compose for local PostgreSQL setup
* More granular API validation
* Improved observability and structured logging

These would be natural extensions without changing the core architecture.

---

# Assignment Alignment

| Requirement                | Implementation                   |
| -------------------------- | -------------------------------- |
| React frontend             | React + Vite                     |
| Node backend               | Node.js + Express                |
| PostgreSQL                 | PostgreSQL                       |
| ORM                        | Prisma                           |
| User authentication        | JWT                              |
| Secure password storage    | bcryptjs                         |
| IANA timezone              | Stored on User                   |
| Habit CRUD                 | Implemented                      |
| Check-ins                  | Implemented                      |
| One check-in per local day | Database unique constraint       |
| User ownership             | Server-side authorization checks |
| Server-side streaks        | Implemented with Luxon           |
| Responsive UI              | Implemented                      |
| API error handling         | Implemented                      |
| Database migrations        | Prisma migrations                |
| Environment secrets        | `.env`                           |
| Git history                | Incremental feature commits      |

---

# Repository

GitHub:

https://github.com/Rufith7/habit-tracker

---

# Submission

**Position:** Product Engineering Intern — Full Stack

**Assignment:** Habit Tracker with Streaks

**Developer:** Ruffith Shaik

**Submission email:** `rufiths@gmail.com`

**Repository:** `https://github.com/Rufith7/habit-tracker`

---

## Final Note

The central design principle of this project is simple:

```text
A habit streak is a sequence of local calendar days,
not a sequence of elapsed hours.
```

The backend owns that rule, the database protects its invariants, and the frontend presents the resulting state.
