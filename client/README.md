# Habit Tracker

A modern, full-stack habit tracking application that helps users create habits, track daily check-ins, maintain streaks, and monitor their progress.

Built with **React, Node.js, Express, PostgreSQL, and Prisma**, with JWT-based authentication and a responsive modern UI.

## ✨ Features

### 🔐 Authentication

* User registration and login
* JWT-based authentication
* Protected API routes
* Persistent login using local storage
* Logout functionality
* User-specific habit data
* Automatic timezone detection during registration

### 📋 Habit Management

* Create new habits
* View all personal habits
* View individual habits
* Habit descriptions
* User-specific habit isolation

### ✅ Daily Check-ins

* Mark habits as completed for the current day
* Prevent duplicate daily check-ins
* View habit check-in history
* Delete check-ins
* Track completion status

### 📊 Statistics

* Total habits
* Completed habits today
* Current streak
* Longest streak
* Total check-ins
* Timezone-aware streak calculations

### 🎨 Modern UI

* Responsive dashboard
* Modern authentication screen
* Clean habit cards
* Statistics cards
* Responsive layout
* Modern buttons and interactions
* Mobile-friendly design
* Loading and error states

---

## 🛠️ Tech Stack

### Frontend

* React
* JavaScript
* Vite
* CSS
* Fetch API

### Backend

* Node.js
* Express.js
* JWT
* bcryptjs
* CORS
* Luxon

### Database

* PostgreSQL
* Prisma ORM

### Development Tools

* Git
* GitHub
* npm
* ESLint

---

## 📁 Project Structure

```text
habit-tracker/
│
├── client/
│   ├── public/
│   │
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
│   │   └── schema.prisma
│   │
│   └── src/
│       ├── controllers/
│       │   ├── authController.js
│       │   ├── checkInController.js
│       │   ├── habitController.js
│       │   └── statsController.js
│       │
│       ├── middleware/
│       │   └── auth.js
│       │
│       ├── routes/
│       │   ├── authRoutes.js
│       │   ├── checkInRoutes.js
│       │   └── habitRoutes.js
│       │
│       ├── lib/
│       │   └── prisma.js
│       │
│       └── server.js
│
├── .gitignore
└── README.md
```

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Rufith7/habit-tracker.git
cd habit-tracker
```

### 2. Install frontend dependencies

```bash
cd client
npm install
```

### 3. Install backend dependencies

Open another terminal:

```bash
cd server
npm install
```

---

## 🔑 Environment Variables

Create a `.env` file inside the `server` directory.

```env
DATABASE_URL="your_postgresql_connection_string"
JWT_SECRET="your_secure_jwt_secret"
PORT=5001
```

### Example

```env
DATABASE_URL="postgresql://username:password@localhost:5432/habit_tracker"
JWT_SECRET="your-super-secret-jwt-key"
PORT=5001
```

**Do not commit your `.env` file to GitHub.**

---

## 🗄️ Database Setup

From the `server` directory:

```bash
npx prisma generate
```

Then run the Prisma migration:

```bash
npx prisma migrate dev
```

If the database schema is already configured and you only need to synchronize it:

```bash
npx prisma db push
```

---

## ▶️ Run the Application

### Start the backend

From the `server` directory:

```bash
npm run dev
```

The API runs on:

```text
http://localhost:5001
```

Health check:

```text
http://localhost:5001/api/health
```

### Start the frontend

Open another terminal:

```bash
cd client
npm run dev
```

Vite will provide the local development URL, normally:

```text
http://localhost:5173
```

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint             | Description            |
| ------ | -------------------- | ---------------------- |
| POST   | `/api/auth/register` | Register a new user    |
| POST   | `/api/auth/login`    | Login                  |
| GET    | `/api/auth/me`       | Get authenticated user |

### Habits

| Method | Endpoint          | Description          |
| ------ | ----------------- | -------------------- |
| POST   | `/api/habits`     | Create habit         |
| GET    | `/api/habits`     | Get user's habits    |
| GET    | `/api/habits/:id` | Get a specific habit |

### Check-ins

| Method | Endpoint                              | Description           |
| ------ | ------------------------------------- | --------------------- |
| POST   | `/api/habits/:id/check-ins`           | Create daily check-in |
| GET    | `/api/habits/:id/check-ins`           | Get habit check-ins   |

### Statistics

| Method | Endpoint                | Description          |
| ------ | ----------------------- | -------------------- |
| GET    | `/api/habits/:id/stats` | Get habit statistics |

---

## 🔐 Authentication Flow

The application uses JWT authentication.

1. User registers an account.
2. User logs in with email and password.
3. Backend validates the credentials.
4. Backend generates a JWT.
5. Frontend stores the token in `localStorage`.
6. API requests include the token using the `Authorization` header.
7. Protected backend routes validate the token.
8. Users can only access their own habits and check-ins.

Example authorization header:

```text
Authorization: Bearer <JWT_TOKEN>
```

---

## 📈 Habit Statistics

The application calculates:

* Current streak
* Longest streak
* Total check-ins
* Today's completion status

Streak calculations use the user's configured timezone to determine the correct local day.

---

## 🧪 Testing the Application

After starting both frontend and backend:

1. Open the frontend.
2. Create a new account.
3. Log in.
4. Create a habit.
5. Confirm the habit appears on the dashboard.
6. Click the check-in button.
7. Confirm the check-in is recorded.
8. Verify the statistics update.
9. Log out.
10. Log back in and verify the data persists.

---

## 🚀 Future Improvements

Possible future enhancements include:

* Habit editing UI
* Habit deletion confirmation
* Calendar-based habit history
* Weekly and monthly analytics
* Progress charts
* Habit categories
* Habit reminders
* Browser notifications
* Dark/light theme toggle
* Password reset
* Profile settings
* Deployment with production environment variables
* Automated frontend and backend tests

---

## 📌 Project Status

**Status: Functional MVP**

The application currently supports authentication, habit management, daily check-ins, streak calculations, statistics, and a responsive modern frontend.

---

## 👨‍💻 Author

**Rufith Shaik**

MCA Graduate | Frontend Developer | React.js | JavaScript

GitHub: [Rufith7](https://github.com/Rufith7)

---

## 📄 License

This project is intended for learning, portfolio, and demonstration purposes.
