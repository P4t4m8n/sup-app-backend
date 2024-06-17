import express from "express";
import { login, signup, logout, checkSession } from "./auth.controller";

export const authRoutes = express.Router();
authRoutes.post("/login", login);
authRoutes.post("/signup", signup);
authRoutes.post("/logout", logout);
authRoutes.get("/verify", checkSession);
