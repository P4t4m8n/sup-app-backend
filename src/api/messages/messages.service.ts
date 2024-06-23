import { dbService } from "../../services/db.service";
import { ObjectId } from "mongodb";
import { MessageModel, MessageStatusType } from "./messages.model";

const queryByUser = async (userId: string) => {
  const collection = await dbService.getCollection("messages");
  const messages = await collection
    .find({ owner: { _id: new ObjectId(userId) } })
    .toArray();
  return messages;
};

const queryByChat = async (chatId: string): Promise<MessageModel[]> => {
  const collection = await dbService.getCollection("messages");
  const messages = await collection
    .find({ chatId: new ObjectId(chatId) })
    .toArray();
  return messages.map((message) => {
    return {
      _id: message._id,
      userId: message.userId,
      message: message.message,
      chatId: message.chatId,
      createAt: message._id.getTimestamp(),
      status: message.status,
    };
  });
};

const getById = async (id: string): Promise<MessageModel | null> => {
  const collection = await dbService.getCollection("messages");
  const message = await collection.findOne({ _id: new ObjectId(id) });
  if (message) {
    return {
      _id: message._id,
      userId: message.userId,
      message: message.message,
      chatId: message.chatId,
      status: message.status,
    };
  }
  return null;
};

const remove = async (id: string): Promise<boolean> => {
  const collection = await dbService.getCollection("messages");
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
};

const create = async (
  chatId: string,
  userId: string,
  message: string
): Promise<MessageModel> => {
  const collection = await dbService.getCollection("messages");

  const chatIdObj = new ObjectId(chatId);
  const userIdObj = new ObjectId(userId);
  const result = await collection.insertOne({
    chatId: chatIdObj,
    userId: userIdObj,
    message,
    status: "sent",
  });

  const createdMessage: MessageModel = {
    _id: result.insertedId,
    chatId: chatIdObj,
    message,
    userId: userIdObj,
    status: "sent",
    createAt: new Date(result.insertedId.getTimestamp()),
  };

  return createdMessage;
};

const updateText = async (
  message: string,
  messageId: string
): Promise<MessageModel | null> => {
  const collection = await dbService.getCollection("messages");
  const result = await collection.updateOne(
    { _id: new ObjectId(messageId) },
    { $set: { message: message, updatedAt: new Date(), status } }
  );
  if (result.modifiedCount === 1) {
    return result as unknown as MessageModel;
  }
  return null;
};
const updateStatus = async (
  status: MessageStatusType,
  messageId: string
): Promise<MessageModel | null> => {
  const collection = await dbService.getCollection("messages");
  const result = await collection.updateOne(
    { _id: new ObjectId(messageId) },
    { $set: { updatedAt: new Date(), status } }
  );
  if (result.modifiedCount === 1) {
    return result as unknown as MessageModel;
  }
  return null;
};

export const messagesService = {
  queryByUser,
  queryByChat,
  getById,
  remove,
  create,
  updateText,
  updateStatus
};
