import express from "express";
import { getEmail, login, logout, signup } from "../controllers/userController.js";
import verifyTokens from "../middleware/jwtMiddleware.js";
const mainRouter = express.Router();

mainRouter.post("/auth/signup", signup);
mainRouter.post("/auth/login", login);
mainRouter.post("/auth/logout", verifyTokens,logout);
mainRouter.get("/auth/email", verifyTokens, getEmail);

export default mainRouter;
