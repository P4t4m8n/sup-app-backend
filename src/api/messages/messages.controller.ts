import { Request, Response } from "express";
import { messagesService } from "./messages.service";

export const getMessages = async (req: Request, res: Response) => {
  try {
    const filterSortBy = {};
    const massages = await messagesService.query();
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
  try {
    const message = await messagesService.create(req.body);
    res.json(message);
  } catch (err) {
    res.status(500).send({ err: "Failed to create massage" });
  }
};

export const updateMassage = async (req: Request, res: Response) => {
  try {
    const message = await messagesService.update(req.body);
    if (message) {
      res.json(message);
    } else {
      res
        .status(404)
        .send({ err: `Message with id ${req.body._id} not found` });
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
