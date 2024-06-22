import { ObjectId } from "mongodb";

export interface FriendModel {
  _id: ObjectId;
  userId: ObjectId;
  friendId: ObjectId;
  status: "pending" | "accepted" | "rejected";
}
