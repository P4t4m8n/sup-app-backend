import { Request, Response } from "express";
import { friendService } from "./friends.service";
import { userService } from "../user/user.service";

export const getFriends = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const friends = await friendService.query(id);
    res.json(friends);
  } catch (err) {
    res.status(500).send({ err: "Failed to get friends" });
  }
};

export const getFriend = async (req: Request, res: Response) => {
  try {
    const { userId, friendId } = req.params;
    const friend = await friendService.getById(userId, friendId);
    if (friend) {
      res.json(friend);
    } else {
      res.status(404).send({ err: `friend with id ${friendId} not found` });
    }
  } catch (err) {
    res.status(500).send({ err: "Failed to get friend" });
  }
};

export const createFriend = async (req: Request, res: Response) => {
  const { userId, username } = req.body.friend;
  console.log("userName:", username)
  try {
    const userFriend = await userService.getByUsername(username);
    if (!userFriend) {
      res.status(404).send({ err: "User does not exist" });
      return;
    }

    const friendToSave = {
      userId: userId,
      friendId: userFriend._id,
    };

    const friend = await friendService.create(friendToSave);
    res.json(friend);
  } catch (err) {
    res.status(500).send({ err: "Failed to create friend" });
  }
};

export const updateFriend = async (req: Request, res: Response) => {
  const friendToUpdate = {
    userId: req.body.userId,
    friendId: req.body.friendId,
    status: req.body.status,
    _id: req.body._id,
  };

  try {
    const friend = await friendService.update(friendToUpdate);
    if (friend) {
      res.json(friend);
    } else {
      res.status(404).send({ err: `friend with id ${req.body._id} not found` });
    }
  } catch (err) {
    res.status(500).send({ err: "Failed to update friend" });
  }
};

export const deleteFriend = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await friendService.remove(id);
    if (result) {
      res.json({ success: true });
    } else {
      res.status(404).send({ err: `Friend with id ${id} not found` });
    }
  } catch (err) {
    res.status(500).send({ err: "Failed to delete friend" });
  }
};
