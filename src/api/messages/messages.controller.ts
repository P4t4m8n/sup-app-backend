import { Request, Response } from "express";
import { messagesService } from "./messages.service";

export const getMessages = async (req: Request, res: Response) => {
  const { chatId } = req.params;
  try {
    const massages = await messagesService.queryByUser(chatId);
    res.json(massages);
  } catch (err) {
    res.status(500).send({ err: "Failed to get massages" });
  }
};

export const getMassageById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const message = await messagesService.getById(id);
    if (message) {
      res.json(message);
    } else {
      res.status(404).send({ err: `Message with id ${id} not found` });
    }
  } catch (err) {
    res.status(500).send({ err: "Failed to get massage" });
  }
};

export const createMassage = async (req: Request, res: Response) => {
  const { chatId, userId, message, senderUserName } = req.body;
  try {
    const newMessage = await messagesService.create(
      chatId,
      userId,
      message,
      senderUserName
    );
    res.json(newMessage);
  } catch (err) {
    res.status(500).send({ err: "Failed to create massage" });
  }
};

export const updateMassage = async (req: Request, res: Response) => {
  const { message, messageId } = req.body;
  try {
    const updatedMessage = await messagesService.update(message, messageId);
    if (updatedMessage) {
      res.json(updatedMessage);
    } else {
      res.status(404).send({ err: `Message with id ${messageId} not found` });
    }
  } catch (err) {
    res.status(500).send({ err: "Failed to update massage" });
  }
};

export const deleteMassage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await messagesService.remove(id);
    if (result) {
      res.json({ success: true });
    } else {
      res.status(404).send({ err: `Message with id ${id} not found` });
    }
  } catch (err) {
    res.status(500).send({ err: "Failed to delete massage" });
  }
};
