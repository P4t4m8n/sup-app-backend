import express from "express";
import {
  createMassage,
  deleteMassage,
  getMassageById,
  getMessages,
} from "./messages.controller";

export const massageRoutes = express.Router();

massageRoutes.get("/", getMessages);
massageRoutes.get("/:id", getMassageById);
massageRoutes.post("/edit", createMassage);
massageRoutes.put("/edit/:id", createMassage);
massageRoutes.delete("/:id", deleteMassage);
