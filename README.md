# 🎓 Student Deadline and Assignment Manager

A full-stack **MERN** web application that helps students manage assignments, track deadlines, organize subjects, and monitor academic progress — all from a single, clean dashboard.

Built with a strict focus on the core problem (assignment & deadline tracking) — no unnecessary enterprise or AI features, just a fast, professional, and fully functional tool suitable for a college/MCA mini-project submission or as a real personal productivity app.

---

## ✨ Features

### Authentication
- Register / Login / Logout
- JWT-based authentication with bcrypt password hashing
- Protected routes (frontend + backend)
- Persistent login (session restored on refresh)

### Profile
- Edit name & email
- Upload/change profile picture
- Change password securely

### Dashboard
- Welcome message with live current date & time
- Total / Pending / Completed / Overdue assignment counts
- Completion percentage with animated progress ring
- Pie chart (status breakdown) and bar chart (priority distribution) via Chart.js
- Upcoming deadlines list
- Recent assignments list
- Quick action buttons (new assignment, add subject)

### Assignment Management
- Create, edit, delete, view, and mark assignments as completed
- Fields: Title, Subject, Description, Due Date, Priority (High/Medium/Low), Status (Pending/In Progress/Completed)
- Responsive card-based layout

### Subject Management
- Add, edit, delete subjects with custom color tags
- Deleting a subject also removes its associated assignments (with confirmation)

### Search, Filter & Sort
- Instant search by title or subject
- Filter by subject, priority, and status
- Sort by newest, oldest, due date, or priority

### Deadline Reminders
- Automatic labels: **Overdue**, **Due Today**, **Due Tomorrow**, **Upcoming**
- Color-coded badges (red for overdue, orange/amber for urgent, etc.)

### UI/UX
- Modern, responsive design (desktop, tablet, mobile) built with Tailwind CSS
- Rounded cards, soft shadows, smooth hover/transition animations
- Toast notifications, loading spinners, empty states, and confirm-before-delete dialogs
- Collapsible sidebar navigation and sticky top navbar

---

## 🛠 Tech Stack

**Frontend:** React.js, React Router DOM, Axios, Tailwind CSS, React Icons, React Hook Form, React Hot Toast, Chart.js (via react-chartjs-2)

**Backend:** Node.js, Express.js (MVC architecture)

**Database:** MongoDB Atlas + Mongoose ODM

**Auth & Security:** JWT, bcryptjs, express-validator

**File Uploads:** Multer (profile pictures only)

---

## 📁 Folder Structure

```
student-deadline-manager/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── assignmentController.js
│   │   └── subjectController.js
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT protect
│   │   ├── errorMiddleware.js
│   │   └── uploadMiddleware.js    # Multer config
│   ├── models/
│   │   ├── User.js
│   │   ├── Subject.js
│   │   └── Assignment.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── assignmentRoutes.js
│   │   └── subjectRoutes.js
│   ├── utils/
│   │   └── generateToken.js
│   ├── uploads/profiles/          # Uploaded profile pictures
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/            # Reusable UI components
│   │   ├── pages/                 # Login, Register, Dashboard, Assignments, Subjects, Profile
│   │   ├── layouts/                # DashboardLayout
│   │   ├── context/                # AuthContext
│   │   ├── hooks/                  # useAuth
│   │   ├── services/                # api.js, authService, assignmentService, subjectService
│   │   ├── utils/                   # dateUtils
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vite.config.js
│
└── README.md
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm
- A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) account (or a local MongoDB instance)

### 1. Clone / Extract the Project
```bash
cd student-deadline-manager
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in `backend/` (copy from `.env.example`):
```bash
cp .env.example .env
```

Fill in your values:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/student-deadline-manager?retryWrites=true&w=majority
JWT_SECRET=replace_this_with_a_long_random_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Start the backend:
```bash
npm run dev      # with nodemon (auto-restart)
# or
npm start        # plain node
```

The API will run at `http://localhost:5000`.

### 3. Frontend Setup
Open a new terminal:
```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/` (copy from `.env.example`):
```bash
cp .env.example .env
```

```env
VITE_API_URL=http://localhost:5000/api
VITE_SERVER_URL=http://localhost:5000
```

Start the frontend:
```bash
npm run dev
```

The app will run at `http://localhost:5173`.

---

## 🍃 MongoDB Atlas Setup Guide

1. Create a free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas/register).
2. Create a new **Cluster** (the free M0 tier is sufficient).
3. Under **Database Access**, create a database user with a username and password.
4. Under **Network Access**, add your IP address (or `0.0.0.0/0` to allow access from anywhere during development).
5. Click **Connect → Drivers**, copy the connection string, and paste it into `MONGO_URI` in `backend/.env`, replacing `<username>`, `<password>`, and adding your database name (e.g. `student-deadline-manager`).

---

## 🔑 Environment Variables Summary

**backend/.env**
| Variable | Description |
|---|---|
| `PORT` | Port the Express server runs on (default `5000`) |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key used to sign JWT tokens |
| `JWT_EXPIRES_IN` | Token expiry duration (e.g. `7d`) |
| `CLIENT_URL` | Frontend URL, used for CORS |

**frontend/.env**
| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend API (e.g. `http://localhost:5000/api`) |
| `VITE_SERVER_URL` | Base URL of the backend server, used for serving uploaded images |

---

## 📡 REST API Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Log in and receive a JWT |
| GET | `/api/auth/profile` | Private | Get current user's profile |
| PUT | `/api/auth/profile` | Private | Update profile (name, email, password, picture) |

### Assignments (`/api/assignments`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/assignments` | Private | List assignments (supports `search`, `subject`, `priority`, `status`, `sortBy` query params) |
| GET | `/api/assignments/stats` | Private | Dashboard statistics |
| GET | `/api/assignments/:id` | Private | Get a single assignment |
| POST | `/api/assignments` | Private | Create an assignment |
| PUT | `/api/assignments/:id` | Private | Update an assignment |
| PUT | `/api/assignments/:id/complete` | Private | Mark an assignment as completed |
| DELETE | `/api/assignments/:id` | Private | Delete an assignment |

### Subjects (`/api/subjects`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/subjects` | Private | List subjects (with assignment counts) |
| POST | `/api/subjects` | Private | Create a subject |
| PUT | `/api/subjects/:id` | Private | Update a subject |
| DELETE | `/api/subjects/:id` | Private | Delete a subject (and its assignments) |

All private routes require an `Authorization: Bearer <token>` header.

---

## 🔒 Security

- Passwords hashed with bcrypt (salt rounds: 10)
- JWT-based stateless authentication
- Protected API routes via middleware
- Server-side input validation with `express-validator`
- Centralized error handling middleware
- Environment variables for all secrets/config
- File upload restrictions (image types only, 2MB limit) for profile pictures

---

## ☁️ Deployment Steps (Suggested)

### Backend (e.g. Render / Railway)
1. Push the `backend/` folder to a GitHub repository.
2. Create a new Web Service on Render/Railway, pointing to that repo/folder.
3. Set the build command to `npm install` and start command to `npm start`.
4. Add all environment variables from `.env` in the host's dashboard.
5. Update `CLIENT_URL` to your deployed frontend URL.

### Frontend (e.g. Vercel / Netlify)
1. Push the `frontend/` folder to a GitHub repository.
2. Import the project into Vercel/Netlify.
3. Set the build command to `npm run build` and output directory to `dist`.
4. Add environment variables `VITE_API_URL` and `VITE_SERVER_URL` pointing to your deployed backend.

### Database
Your MongoDB Atlas cluster is already cloud-hosted — just make sure Network Access allows connections from your hosting provider (or `0.0.0.0/0`).

---

## 🧪 Verified Build

- ✅ Backend: all files pass syntax checks; Express app boots and wires up all routes correctly.
- ✅ Frontend: `npm run build` completes successfully with Vite (no compile errors).

---

## 📄 License

This project was built for educational purposes (MCA mini-project / portfolio use). Feel free to use and modify it.
