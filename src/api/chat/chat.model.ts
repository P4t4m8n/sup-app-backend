import { ObjectId } from "mongodb";
import { MessageModel } from "../messages/messages.model";
import { UserModel, UserSmallModel } from "../user/user.model";

export interface ChatModel {
  _id: ObjectId;
  users: UserSmallModel[];
  name: string;
  messages?: MessageModel[];
  type: ChatType;

}

export interface ChatToSave {
  users: ObjectId[];
  name: string;
  type: ChatType;
}

export type ChatType = "private" | "group";
