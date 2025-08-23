import express from "express";
import passport from "passport";
import {
    getCurrentUser,
    getEmail,
    githubCallback,
    googleCallback,
    login,
    logout,
    signup,
} from "../controllers/userController.js";
import verifyTokens from "../middleware/jwtMiddleware.js";

const mainRouter = express.Router();

mainRouter.post("/auth/signup", signup);
mainRouter.post("/auth/login", login);
mainRouter.post("/auth/logout", verifyTokens, logout);
mainRouter.get("/auth/email", verifyTokens, getEmail);

mainRouter.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

mainRouter.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    googleCallback
);
mainRouter.get("/auth/current-user", verifyTokens, getCurrentUser);

mainRouter.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

mainRouter.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  githubCallback
);

export default mainRouter;
