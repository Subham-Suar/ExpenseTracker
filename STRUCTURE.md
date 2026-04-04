# 📁 Project Structure Guide

Complete explanation of the ExpenseTracker folder structure and file organization.

## 🏗️ Directory Tree

```
ExpenseTracker/
│
├── 📂 backend/                          # Node.js/Express API Server
│   ├── 📂 config/
│   │   └── db.js                       # MongoDB connection configuration
│   │
│   ├── 📂 controllers/                  # Business logic & route handlers
│   │   ├── dashboardController.js      # Dashboard data aggregation
│   │   ├── expenseController.js        # Expense CRUD & export
│   │   ├── incomeController.js         # Income CRUD operations
│   │   └── userController.js           # Authentication & profile
│   │
│   ├── 📂 middleware/
│   │   └── authMiddleware.js           # JWT authentication check
│   │
│   ├── 📂 models/                       # MongoDB schemas
│   │   ├── expenseModel.js             # Expense document schema
│   │   ├── incomeModel.js              # Income document schema
│   │   └── userModel.js                # User document schema
│   │
│   ├── 📂 routes/                       # API route definitions
│   │   ├── dashboardRoute.js           # Dashboard endpoints
│   │   ├── expenseRoute.js             # /api/expense routes
│   │   ├── incomeRouts.js              # /api/income routes
│   │   └── userRouter.js               # /api/user routes
│   │
│   ├── 📂 testsprite_tests/             # Test files & artifacts
│   │   └── 📂 tmp/
│   │       ├── code_summary.yaml
│   │       ├── config.json
│   │       └── 📂 prd_files/
│   │
│   ├── 📂 utils/
│   │   └── dateFilter.js               # Date filtering utilities
│   │
│   ├── .env                            # 🔐 Environment variables (DO NOT COMMIT)
│   ├── .gitignore                      # Git ignore rules for backend
│   ├── package.json                    # Backend dependencies & scripts
│   ├── package-lock.json               # Locked dependency versions
│   └── server.js                       # Express app entry point
│
├── 📂 frontend/                         # React/Vite SPA
│   ├── 📂 src/
│   │   ├── 📂 assets/                   # Static imports
│   │   │   ├── color.jsx               # Color palette constants
│   │   │   ├── dummy.js                # Dummy data for testing
│   │   │   └── dummyStyle.js           # Style utilities
│   │   │
│   │   ├── 📂 components/               # Reusable React components
│   │   │   ├── Layout.jsx              # Main layout wrapper
│   │   │   ├── Navbar.jsx              # Navigation bar
│   │   │   ├── Navbar.css              # Navbar styles
│   │   │   ├── ProtectedRoute.jsx      # Auth-protected route wrapper
│   │   │   ├── RadialGauge.jsx         # Radial chart component
│   │   │   ├── Sidebar.jsx             # Side navigation menu
│   │   │   └── TransactionManager.jsx  # Transaction CRUD component
│   │   │
│   │   ├── 📂 lib/                      # Utilities & helpers
│   │   │   ├── api.js                  # Axios instance & API calls
│   │   │   ├── format.js               # Data formatting utilities
│   │   │   └── session.js              # Local storage session management
│   │   │
│   │   ├── 📂 pages/                    # Page/Route components
│   │   │   ├── Auth.jsx                # Login/Register page
│   │   │   ├── Dashboard.jsx           # Home dashboard page
│   │   │   ├── Expense.jsx             # Expense tracker page
│   │   │   ├── Income.jsx              # Income tracker page
│   │   │   ├── Profile.jsx             # User profile page
│   │   │   └── SectionPlaceholder.jsx  # Placeholder component
│   │   │
│   │   ├── App.jsx                     # Root component with routes
│   │   ├── main.jsx                    # Vite entry point
│   │   └── index.css                   # Global styles
│   │
│   ├── 📂 public/                       # Static assets served as-is
│   │
│   ├── .env                            # 🔐 Environment variables (DO NOT COMMIT)
│   ├── .gitignore                      # Git ignore rules for frontend
│   ├── eslint.config.js                # ESLint configuration
│   ├── index.html                      # HTML entry point
│   ├── package.json                    # Frontend dependencies & scripts
│   ├── package-lock.json               # Locked dependency versions
│   ├── postcss.config.js               # PostCSS configuration (Tailwind)
│   ├── tailwind.config.js              # Tailwind CSS configuration
│   ├── vite.config.js                  # Vite build & dev config
│   └── README.md                       # Frontend-specific readme
│
├── .git/                               # Git repository metadata
├── .env                                # 🔐 Root environment (if needed)
├── .gitignore                          # Root git ignore rules
├── DEPLOYMENT.md                       # 🚀 Deployment guide
├── ENV_SETUP.md                        # 🔐 Environment setup guide
├── Procfile                            # Heroku deployment config
├── package.json                        # Root mono-repo package
├── README.md                           # Project overview & quick start
└── STRUCTURE.md                        # This file
```

## 📋 File Purposes

### Backend Core Files

| File | Purpose |
|------|---------|
| `server.js` | Express app initialization, middleware setup, route definitions |
| `package.json` | Dependencies (express, mongoose, jwt, etc.) & npm scripts |
| `.env` | Production secrets (MONGODB_URI, JWT_SECRET, SMTP creds) |
| `.env` | Environment variables with documentation and actual values |

### Backend Config
| File | Purpose |
|------|---------|
| `config/db.js` | MongoDB connection using Mongoose |

### Backend Controllers
| File | Purpose |
|------|---------|
| `controllers/userController.js` | User registration, login, profile updates, password changes |
| `controllers/expenseController.js` | CRUD for expenses, Excel download, email export |
| `controllers/incomeController.js` | CRUD for income records, income overview |
| `controllers/dashboardController.js` | Aggregate dashboard data (income, expense, balance) |

### Backend Models
| File | Purpose |
|------|---------|
| `models/userModel.js` | User schema: email, password, name, created_at |
| `models/expenseModel.js` | Expense schema: amount, category, date, user_id |
| `models/incomeModel.js` | Income schema: amount, source, date, user_id |

### Backend Routes
| File | Purpose |
|------|---------|
| `routes/userRouter.js` | /api/user routes: login, register, profile, password |
| `routes/expenseRoute.js` | /api/expense routes: CRUD, download, email, overview |
| `routes/incomeRouts.js` | /api/income routes: CRUD, overview |
| `routes/dashboardRoute.js` | /api/dashboard: aggregated data |

### Frontend Core Files

| File | Purpose |
|------|---------|
| `main.jsx` | React app entry point, React DOM render |
| `App.jsx` | Root component, routing setup (React Router) |
| `index.html` | HTML template for Vite |
| `package.json` | Dependencies (react, vite, tailwind, recharts, etc.) |
| `.env` | Frontend API URL and OAuth credentials |

### Frontend Components

| File | Purpose |
|------|---------|
| `components/Layout.jsx` | Wrapper for page layout with sidebar/navbar |
| `components/Navbar.jsx` | Top navigation bar |
| `components/Sidebar.jsx` | Left side navigation menu |
| `components/ProtectedRoute.jsx` | Auth check wrapper for private routes |
| `components/TransactionManager.jsx` | Reusable income/expense form & list |
| `components/RadialGauge.jsx` | Circular progress chart component |

### Frontend Pages

| File | Purpose |
|------|---------|
| `pages/Auth.jsx` | Login & register forms |
| `pages/Dashboard.jsx` | Home page with income/expense overview |
| `pages/Expense.jsx` | Expense tracker with mode filtering and charts |
| `pages/Income.jsx` | Income tracker with distribution charts |
| `pages/Profile.jsx` | User profile & password update |

### Frontend Utilities

| File | Purpose |
|------|---------|
| `lib/api.js` | Axios instance, API endpoint wrappers |
| `lib/session.js` | localStorage operations for auth tokens |
| `lib/format.js` | Currency, date, number formatting |

### Root Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Mono-repo scripts managing frontend & backend |
| `.env` | Environment variables with documentation and actual values |
| `.gitignore` | Files to exclude from git (node_modules, .env, etc.) |
| `Procfile` | Heroku deployment configuration |
| `README.md` | Project overview, quick start, features |
| `ENV_SETUP.md` | Environment variable setup guide |
| `DEPLOYMENT.md` | Step-by-step deployment instructions |
| `STRUCTURE.md` | This file - folder structure explanation |

## 🔐 Security Files

Files that should NEVER be committed:
- `.env` - Contains secrets
- `node_modules/` - Dependencies (regenerated from package.json)
- `.env.local` - Local overrides
- Any `.env.*` files

These are protected by `.gitignore` files in each directory.

## 📦 Build Outputs

After running `npm run build`:

```
frontend/dist/              # Production build (served by backend)
├── index.html             # Bundled entry point
├── assets/                # Bundled JS/CSS files
└── ...                    # Other static assets
```

## 🚀 Development Files

- Backend uses **nodemon** for hot reload (restart on file changes)
- Frontend uses **Vite** for fast HMR (hot module replacement)
- Both run on different ports: backend (4000), frontend (5173)

## 📊 Database Models

### User Document
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  created_at: Date,
  updated_at: Date
}
```

### Expense Document
```javascript
{
  _id: ObjectId,
  user_id: ObjectId (ref: User),
  amount: Number,
  category: String,
  description: String,
  date: Date,
  created_at: Date
}
```

### Income Document
```javascript
{
  _id: ObjectId,
  user_id: ObjectId (ref: User),
  amount: Number,
  source: String,
  description: String,
  date: Date,
  created_at: Date
}
```

## 🔄 Data Flow

```
User Browser
     ↓
Frontend (React/Vite)
     ↓
API Calls (Axios)
     ↓
Backend (Express)
     ↓
Authentication (JWT Middleware)
     ↓
Controllers (Business Logic)
     ↓
MongoDB (Data Storage)
```

## 🎯 Key Decisions

1. **Monorepo Structure**: Backend and frontend in same repo for easier deployment
2. **ES Modules**: Both use `"type": "module"` in package.json
3. **Environment Variables**: All secrets in .env, never hardcoded
4. **Production Build**: Frontend pre-built, backend serves static files
5. **CORS Enabled**: Allows frontend to call backend API
6. **JWT Auth**: Stateless authentication for scalability

## ✅ Deployment Structure

For production:
1. Backend serves frontend's built files
2. API endpoints under `/api/*`
3. All other routes serve `index.html` (SPA fallback)
4. Environment variables set in deployment platform
5. MongoDB connection string in production MongoDB Atlas

---

**Next Steps:**
- See [README.md](./README.md) for quick start
- See [ENV_SETUP.md](./ENV_SETUP.md) for configuration
- See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment
