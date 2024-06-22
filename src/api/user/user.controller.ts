import { ObjectId } from "mongodb";
import { userService } from "./user.service";
import { Request, Response } from "express";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.query({});
    res.json(users);
  } catch (err) {
    res.status(500).send({ err: "Failed to get users" });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const objectId = new ObjectId(id);
    const user = await userService.getById(objectId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).send({ err: `User with id ${id} not found` });
    }
  } catch (err) {
    res.status(500).send({ err: "Failed to get user" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await userService.create(req.body);
    res.json(user);
  } catch (err) {
    res.status(500).send({ err: "Failed to create user" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await userService.update(req.body);
    if (user) {
      res.json(user);
    } else {
      res.status(404).send({ err: `User with id ${req.body._id} not found` });
    }
  } catch (err) {
    res.status(500).send({ err: "Failed to update user" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await userService.remove(id);
    if (result) {
      res.json({ success: true });
    } else {
      res.status(404).send({ err: `User with id ${id} not found` });
    }
  } catch (err) {
    res.status(500).send({ err: "Failed to delete user" });
  }
};
