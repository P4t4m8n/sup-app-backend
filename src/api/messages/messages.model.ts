import { Document, ObjectId } from "mongodb";

export interface MessageModel extends MessagesToCreate {
  _id: ObjectId;
}

export interface MessagesToCreate extends Document {
  message: string;
  userId: ObjectId;
  updatedAt?: number | null;
  chatId: ObjectId;
  createAt?: Date;
  status: MessageStatusType;
}

export type MessageStatusType = "sent" | "delivered" | "read";
