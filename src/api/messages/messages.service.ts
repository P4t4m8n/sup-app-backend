import { dbService } from "../../services/db.service";
import { ObjectId } from "mongodb";
import { MessageModel, MessagesToCreate } from "./messages.model";

const query = async (filterSortBy = {}) => {
  const collection = await dbService.getCollection("messages");
  const messages = await collection.find().sort(filterSortBy).toArray();
  return messages;
};

const getById = async (id: string): Promise<MessageModel | null> => {
  const collection = await dbService.getCollection("messages");
  const message = await collection.findOne({ _id: new ObjectId(id) });
  if (message) {
    return {
      _id: message._id.toString(),
      userId: message.userId,
      text: message.text,
      updatedAt: message.updatedAt || null,
      chatId: message.chatId,
      senderUserName: message.senderUserName,
    };
  }
  return null;
};

const remove = async (id: string): Promise<boolean> => {
  const collection = await dbService.getCollection("messages");
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
};

const create = async (message: MessagesToCreate): Promise<MessageModel> => {
  const collection = await dbService.getCollection("messages");
  const result = await collection.insertOne({
    ...message,
    createAt: new Date(),
  });

  const createdMessage: MessageModel = {
    _id: result.insertedId.toString(),
    userId: message.userId,
    text: message.text,
    chatId: message.chatId,
    senderUserName: message.senderUserName,
    createAt: new Date(result.insertedId.getTimestamp()),
  };

  return createdMessage;
};

const update = async (message: MessageModel): Promise<MessageModel | null> => {
  const collection = await dbService.getCollection("messages");
  const result = await collection.updateOne(
    { _id: new ObjectId(message._id) },
    { $set: { text: message.text, updatedAt: message.updatedAt } }
  );
  if (result.modifiedCount === 1) {
    return message;
  }
  return null;
};

export const messagesService = {
  query,
  getById,
  remove,
  create,
  update,
};
