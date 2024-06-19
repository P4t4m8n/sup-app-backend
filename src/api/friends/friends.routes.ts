import express from "express";
import { createFriend, getFriend, getFriends } from "./friends.controller";

export const FriendRoutes = express.Router();

FriendRoutes.get("/", getFriends);
FriendRoutes.get("/:id", getFriend);
FriendRoutes.post("/edit", createFriend);
FriendRoutes.put("/edit/:id", createFriend);
FriendRoutes.delete("/:id", createFriend);
