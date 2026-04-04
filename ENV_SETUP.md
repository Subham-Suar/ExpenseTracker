# 🔐 Environment Variables Setup Guide

Your ExpenseTracker application now uses environment variables to securely manage all sensitive configuration data. No more hardcoded secrets!

## What Changed

### Backend Security Updates
1. **JWT_SECRET** - Moved from hardcoded value to `process.env.JWT_SECRET`
2. **MongoDB URI** - Now requires `MONGODB_URI` environment variable
3. **TOKEN_EXPIRES** - Configurable via `TOKEN_EXPIRES` env var
4. **SMTP Configuration** - Already using environment variables for email

### Frontend Updates
1. **API URL** - Uses `VITE_API_URL` environment variable
2. **.env files** - Added to `.gitignore` to prevent accidental commits

---

## Setup Instructions

### Backend Setup

1. **Install dependencies** (if not already done):
   ```bash
   cd backend
   npm install
   ```

2. **Create your `.env` file**:
   ```bash
   cp .env.example .env
   ```

3. **Edit `backend/.env` with your actual values**:
   ```env
   PORT=4000
   FRONTEND_URL=http://localhost:5173,http://127.0.0.1:5173
   
   # Required - Get from MongoDB Atlas
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
   
   # Required - Generate a strong random string for production
   JWT_SECRET=your-super-secret-jwt-key-min-32-chars-recommended
   
   # Optional - For email export feature
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   FROM_EMAIL=noreply@expensetracker.com
   ```

4. **Generate a strong JWT_SECRET**:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

### Frontend Setup

1. **Create your `.env` file**:
   ```bash
   cd frontend
   cp .env.example .env
   ```

2. **Edit `frontend/.env`**:
   ```env
   VITE_API_URL=http://localhost:4000/api
   
   # Optional OAuth credentials (if enabling OAuth)
   VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
   VITE_FACEBOOK_APP_ID=your_facebook_app_id_here
   ```

---

## Running the Application

### Development

**Terminal 1 - Backend**:
```bash
cd backend
npm start
```

**Terminal 2 - Frontend**:
```bash
cd frontend
npm run dev
```

### Production

Before deploying, ensure all required environment variables are set in your deployment platform (Vercel, Heroku, AWS, etc.)

---

## MongoDB Connection String

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster (if you haven't already)
3. Get your connection string from the "Connect" button
4. Replace username, password, and database name
5. Add to `MONGODB_URI` in `.env`

**Example**:
```
mongodb+srv://dbuser:dbpassword@cluster0.n5yc7rl.mongodb.net/ExpenseTracker
```

---

## Gmail SMTP Setup (for Email Export)

If you want to enable email export functionality:

1. Enable 2-factor authentication on your Gmail account
2. Generate an [App Password](https://myaccount.google.com/apppasswords)
3. Use the generated 16-character password for `SMTP_PASS`
4. Set `SMTP_USER` to your Gmail address
5. Uncomment SMTP settings in `.env`

---

## Security Best Practices

❌ **Never commit `.env` files to Git**
- They are already in `.gitignore`
- Each developer should have their own `.env`

✅ **Rotate JWT_SECRET regularly** in production
✅ **Use strong, unique passwords** for database and email
✅ **Keep .env.example** updated with new variables
✅ **Use different secrets** for dev and production
✅ **Store production secrets** in your deployment platform

---

## Troubleshooting

### "MONGODB_URI is not defined"
- Check that `.env` file exists in backend folder
- Verify `MONGODB_URI` is set with a valid connection string
- Restart the backend server

### "Token invalid or expire"
- Ensure `JWT_SECRET` is the same in `.env` and in your deployment
- Check that all running instances use the same secret

### "SMTP configuration is missing"
- This is expected if you haven't configured email
- The app will skip email and use download fallback
- No action needed unless you want to enable email export

### "Cannot find module 'dotenv'"
- Run `npm install` in the backend folder
- `dotenv` should already be in package.json

---

## Environment Variables Reference

### Backend
| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `PORT` | No | 4000 | Server port |
| `FRONTEND_URL` | No | localhost:5173 | CORS origins |
| `MONGODB_URI` | Yes | - | Database connection |
| `JWT_SECRET` | Yes | 'your_jwt_secret_here' | Token signing |
| `TOKEN_EXPIRES` | No | 24h | Token expiry |
| `SMTP_HOST` | No | - | Email server host |
| `SMTP_PORT` | No | 587 | Email server port |
| `SMTP_SECURE` | No | false | TLS/SSL enabled |
| `SMTP_USER` | No | - | Email sender address |
| `SMTP_PASS` | No | - | Email password |
| `FROM_EMAIL` | No | - | Sender email |

### Frontend
| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `VITE_API_URL` | No | http://localhost:4000/api | Backend API URL |
| `VITE_GOOGLE_CLIENT_ID` | No | - | Google OAuth ID |
| `VITE_FACEBOOK_APP_ID` | No | - | Facebook App ID |

---

## What's Protected Now

✅ Sensitive data is now in `.env` (not in git)
✅ Database credentials secured
✅ JWT secret secured
✅ Email credentials secured
✅ API URLs configurable per environment

Your application is now production-ready from a secrets management perspective! 🎉
