import express from "express";
import { getChatById, getChats } from "./chat.controller";

export const chatRoutes = express.Router();

chatRoutes.get("/:userId", getChats);
chatRoutes.get("/chat/:id", getChatById);
