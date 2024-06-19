import express from "express";
import { createFriend, getFriends, updateFriend } from "./friends.controller";

export const FriendRoutes = express.Router();

FriendRoutes.get("/:id", getFriends);
FriendRoutes.post("/", createFriend);
FriendRoutes.put("/:id", updateFriend);
FriendRoutes.delete("/:id", createFriend);
