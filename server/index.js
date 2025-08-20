import 'dotenv/config';
import express from "express";
import { connectDB } from './config/db.js';
import mainRouter from './routers/mainRouter.js';
import cookieParser from 'cookie-parser';
import cors from "cors";

const app = express();
const port = process.env.PORT || 5000;

// ✅ CORS setup
app.use(
  cors({
    origin: "http://localhost:5173", // your React frontend URL
    credentials: true, // if you want to allow cookies/auth headers
  })
);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// DB
connectDB();

// Routes
app.use("/api", mainRouter);

app.listen(port, () => {
  console.log(`Server Started on http://localhost:${port}`);
});
