import { Document, ObjectId } from "mongodb";

export interface MessageModel extends MessagesToCreate {
  _id: ObjectId;
}

export interface MessagesToCreate extends Document {
  message: string;
  userId: ObjectId;
  updatedAt?: number | null;
  chatId: ObjectId;
  senderUserName: string;
  createAt?: Date;
}
