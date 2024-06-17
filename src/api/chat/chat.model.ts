import { MessageModel } from "../messages/messages.model";
import { UserModel } from "../user/user.model";

export interface ChatModel {
  _id?: string;
  users: UserModel[];
  messages: string[];
  name: string;
}
