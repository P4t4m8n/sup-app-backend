import { Request, Response } from "express";
import { chatService } from "./chat.service";

export const getChats = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const chats = await chatService.query(userId);
    res.json(chats);
  } catch (err) {
    res.status(500).send({ err: "Failed to get chats" });
  }
};

export const getChatById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const chat = await chatService.getById(id);
    if (chat) {
      res.json(chat);
    } else {
      res.status(404).send({ err: `Chat with id ${id} not found` });
    }
  } catch (err) {
    res.status(500).send({ err: "Failed to get chat" });
  }
};

export const createChat = async (req: Request, res: Response) => {
  try {
    const chat = await chatService.create(req.body);
    res.json(chat);
  } catch (err) {
    res.status(500).send({ err: "Failed to create chat" });
  }
};

export const updateChat = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const chat = await chatService.update(id, req.body);
    if (chat) {
      res.json(chat);
    } else {
      res.status(404).send({ err: `Chat with id ${id} not found` });
    }
  } catch (err) {
    res.status(500).send({ err: "Failed to update chat" });
  }
};

export const deleteChat = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await chatService.remove(id);
    if (result) {
      res.json({ success: true });
    } else {
      res.status(404).send({ err: `Chat with id ${id} not found` });
    }
  } catch (err) {
    res.status(500).send({ err: "Failed to delete chat" });
  }
};
