import express from "express";
import {
  createChat,
  getChatById,
  getChats,
  updateChat,
  deleteChat,
} from "./chat.controller";

export const chatRoutes = express.Router();

chatRoutes.get("/", getChats);
chatRoutes.get("/:id", getChatById);
chatRoutes.post("/", createChat);
chatRoutes.put("/:id", updateChat);
chatRoutes.delete("/:id", deleteChat);
