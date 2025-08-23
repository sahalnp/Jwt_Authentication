// server.js
import 'dotenv/config';
import express from "express";
import { connectDB } from './config/db.js';
import mainRouter from './routers/mainRouter.js';
import cookieParser from 'cookie-parser';
import cors from "cors";
import passport from "passport";
import "./config/passport.js";
import session from "express-session";

const app = express();
const port = process.env.PORT || 5000;

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Session middleware (MUST be before passport)
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // Set to true in production with HTTPS
    httpOnly: true,
    maxAge: 5 * 60 * 1000 // 5 minutes (only for OAuth)
  }
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Passport middleware (MUST be after session)
app.use(passport.initialize());
app.use(passport.session());

// Connect to database
connectDB();

// Routes
app.use("/api", mainRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error' 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

app.listen(port, () => {
  console.log(`🚀 Server Started on http://localhost:${port}`);
});