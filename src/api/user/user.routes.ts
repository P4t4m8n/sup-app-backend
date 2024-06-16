import express from "express";
import { createUser, getUser, getUsers } from "./user.controller";

export const userRoutes = express.Router();

userRoutes.get("/", getUsers);
userRoutes.get("/:id", getUser);
userRoutes.post("/edit", createUser);
userRoutes.put("/edit/:id", createUser);
userRoutes.delete("/:id", createUser);
