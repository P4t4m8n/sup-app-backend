import { MessageModel } from "../messages/messages.model";
import { UserModel, UserSmallModel } from "../user/user.model";

export interface ChatModel {
  _id?: string;
  users: UserSmallModel[];
  name: string;
}
