import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import {connectDB} from './config/db.js'
import userRouter from './routes/userRouter.js'
import incomeRouter from './routes/incomeRouts.js';
import expenseRouter from './routes/expenseRoute.js';
import dashboardRouter from './routes/dashboardRoute.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === 'production';

const app = express();
const port = Number(process.env.PORT) || 4000;
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173,http://127.0.0.1:5173")
  .split(",")
  .map((origin) => origin.trim());

function isAllowedOrigin(origin) {
  if (!origin) {
    return true;
  }

  if (allowedOrigins.includes(origin)) {
    return true;
  }

  try {
    const { hostname } = new URL(origin);
    return hostname === "localhost" || hostname === "127.0.0.1";
  } catch {
    return false;
  }
}

//MIDDLEWARES
app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({extended: true}))

// Serve static files from frontend build in production
if (isProduction) {
  const frontendBuildPath = path.join(__dirname, '../frontend/dist');
  app.use(express.static(frontendBuildPath));
}

//DB
connectDB();

//ROUTES
app.use("/api/user", userRouter);
app.use("/api/income", incomeRouter);
app.use("/api/expense", expenseRouter);
app.use("/api/dashboard", dashboardRouter);

// API health check
app.get('/api', (req, res) => {
  res.json({ message: 'API is working', environment: process.env.NODE_ENV || 'development' });
});

// Development fallback
app.get('/', (req, res) => {
  res.json({ message: 'Expense Tracker API - Backend Server is working', environment: process.env.NODE_ENV || 'development' });
});

// SPA fallback: Serve index.html for all non-API routes in production
if (isProduction) {
  app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

app.listen(port, () => {
  console.log(`Server listening on PORT:${port} | Environment: ${process.env.NODE_ENV || 'development'}`);
});
