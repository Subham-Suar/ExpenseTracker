# 📊 Expense Tracker - Full Stack Application

A modern, full-stack expense tracking application built with React, Node.js/Express, MongoDB, and modern web technologies.

## 🏗️ Project Structure

```
ExpenseTracker/
├── backend/                    # Node.js/Express API server
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/            # Route handlers
│   ├── middleware/             # Express middleware (auth, etc.)
│   ├── models/                 # MongoDB schemas
│   ├── routes/                 # API routes
│   ├── utils/                  # Helper functions
│   ├── .env                    # Environment variables (DO NOT COMMIT)
│   ├── .gitignore              # Git ignore rules
│   ├── server.js               # Express server entry point
│   └── package.json            # Backend dependencies
│
├── frontend/                   # React/Vite frontend
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # Reusable React components
│   │   ├── pages/              # Page components
│   │   ├── lib/                # Utilities & API helpers
│   │   ├── assets/             # Images, styles
│   │   ├── App.jsx             # Main App component
│   │   ├── main.jsx            # Vite entry point
│   │   └── index.css           # Global styles
│   ├── .env                    # Environment variables (DO NOT COMMIT)
│   ├── .gitignore              # Git ignore rules
│   ├── vite.config.js          # Vite configuration
│   ├── tailwind.config.js      # Tailwind CSS config
│   ├── package.json            # Frontend dependencies
│   └── eslint.config.js        # ESLint configuration
│
├── .gitignore                  # Root .gitignore
├── ENV_SETUP.md               # Environment setup guide
└── README.md                  # This file
```

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/cloud/atlas) Account (for database)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ExpenseTracker
   ```

2. **Install dependencies for all packages**
   ```bash
   npm run install:all
   ```

3. **Configure environment variables**
   - Backend: Edit `backend/.env` with your actual values
   - Frontend: Edit `frontend/.env` with your actual values

### Development

Run both frontend and backend concurrently:
```bash
npm run dev
```

Or run them separately:
```bash
# Terminal 1 - Backend
npm run backend

# Terminal 2 - Frontend
npm run frontend
```

**Frontend**: http://localhost:5173
**Backend API**: http://localhost:4000

### Production Build

1. **Build the frontend**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm run start:prod
   ```

   Or run both build and production start from the root:
   ```bash
   npm run prod
   ```

The server will run on port 4000 and serve the React app.

## 📋 Available Scripts

### Root Scripts
```bash
npm run install:all        # Install dependencies for all packages
npm run dev               # Run backend and frontend concurrently (dev)
npm run build             # Build frontend production bundle
npm run start             # Start backend server
npm run start:prod        # Start backend in production mode (NODE_ENV=production)
npm run prod              # Build frontend and start production server
npm run backend           # Start only backend
npm run frontend          # Start only frontend (dev)
```

### Backend Scripts (from backend/)
```bash
npm start                 # Start backend server with nodemon
npm test                  # Run tests
```

### Frontend Scripts (from frontend/)
```bash
npm run dev              # Start Vite dev server
npm run build            # Build production bundle
npm run preview          # Preview production build
npm run lint             # Run ESLint
```

## 🔐 Environment Variables

### Backend (.env)
```env
PORT=4000
FRONTEND_URL=http://localhost:5173,http://127.0.0.1:5173
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
JWT_SECRET=your-secret-jwt-key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:4000/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_FACEBOOK_APP_ID=your-facebook-app-id
```

See [ENV_SETUP.md](./ENV_SETUP.md) for detailed setup instructions.

## 🏠 Features

- ✅ User Authentication (JWT)
- ✅ Income & Expense Tracking
- ✅ Dashboard with Analytics & Charts
- ✅ Expense Export (Excel & Email)
- ✅ Responsive Design with Tailwind CSS
- ✅ Modern UI with Framer Motion Animations
- ✅ Real-time Charts with Recharts
- ✅ Category-based Expense/Income Management
- ✅ Profile Management & Password Update
- ✅ Multiple Time Period Analysis (Daily, Weekly, Monthly, Yearly)

## 🛠️ Technology Stack

### Frontend
- **React** 19.2.4 - UI Library
- **Vite** 8.0.1 - Build tool & dev server
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Recharts** - Charts & Graphs
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Toastify** - Notifications

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Nodemailer** - Email service
- **XLSX** - Excel file generation

## 📦 Deployment

### Deploy to Heroku

1. **Install Heroku CLI**
2. **Create Procfile**
   ```
   web: npm start
   ```
3. **Set environment variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=<your-mongodb-uri>
   heroku config:set JWT_SECRET=<strong-secret>
   heroku config:set FRONTEND_URL=<your-heroku-url>
   ```
4. **Deploy**
   ```bash
   git push heroku main
   ```

### Deploy to Vercel (Frontend Only)

1. **Build the frontend**
   ```bash
   npm run build
   ```
2. **Connect to Vercel** and deploy the `frontend/dist` folder
3. **Set environment variables** in Vercel dashboard

### Deploy to AWS/Azure/Google Cloud

Build the project and deploy:
1. Run `npm run build` to create frontend build
2. Deploy backend server (can use App Engine, Elastic Beanstalk, etc.)
3. Configure environment variables in cloud dashboard

## 🔍 API Endpoints

### Authentication
- `POST /api/user/register` - Register new user
- `POST /api/user/login` - Login user
- `GET /api/user/me` - Get current user (protected)
- `PUT /api/user/profile` - Update profile (protected)
- `PUT /api/user/password` - Update password (protected)

### Income
- `GET /api/income/get` - Get all income records (protected)
- `POST /api/income/add` - Add income (protected)
- `PUT /api/income/update/:id` - Update income (protected)
- `DELETE /api/income/delete/:id` - Delete income (protected)
- `GET /api/income/overview` - Get income overview (protected)

### Expense
- `GET /api/expense/get` - Get all expenses (protected)
- `POST /api/expense/add` - Add expense (protected)
- `PUT /api/expense/update/:id` - Update expense (protected)
- `DELETE /api/expense/delete/:id` - Delete expense (protected)
- `GET /api/expense/downloadexcel` - Download expense Excel (protected)
- `POST /api/expense/sendexcel` - Send expense via email (protected)
- `GET /api/expense/overview` - Get expense overview (protected)

### Dashboard
- `GET /api/dashboard` - Get dashboard overview (protected)

## 🛡️ Security

- JWT-based authentication with 24h token expiry
- Password hashing with bcrypt
- CORS protection
- Environment variables for sensitive data
- No hardcoded secrets
- `.env` files in .gitignore

## 📝 Notes for Deployment

1. **Build frontend first**: `npm run build`
2. **Set NODE_ENV=production** before starting server
3. **Ensure .env is configured** with production values
4. **Use strong JWT_SECRET** (min 32 characters recommended)
5. **MongoDB Atlas** connection should be secured
6. **SMTP credentials** (optional for email export)
7. **HTTPS recommended** for production

## ❓ Troubleshooting

### Port 4000 already in use
```bash
# Find and kill process using port 4000
lsof -i :4000
kill -9 <PID>
```

### MongoDB connection fails
- Check MONGODB_URI is correct
- Verify MongoDB Atlas IP whitelist includes server IP
- Ensure database user has proper permissions

### Frontend API calls fail
- Check VITE_API_URL matches backend URL
- Verify CORS configuration in server.js
- Check FRONTEND_URL in backend .env

### "Cannot find module" errors
- Run `npm run install:all` in root directory
- Check package.json has required dependencies
- Clear node_modules: `rm -rf */node_modules`

## 📞 Support

For issues, please check:
1. [ENV_SETUP.md](./ENV_SETUP.md) - Environment configuration
2. Backend logs - `npm start` in backend directory
3. Frontend console - Browser developer tools
4. MongoDB Atlas dashboard - Database status

## 📄 License

ISC

---

**Happy tracking! 💰**
