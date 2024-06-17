import { ObjectId } from "mongodb";
import { dbService } from "../../services/db.service";
import { ChatModel } from "./chat.model";

const query = async (userId: string): Promise<ChatModel[]> => {
  const collection = await dbService.getCollection("chats");

  const chats = await collection
    .find({ users: { $elemMatch: { _id: userId } } })
    .toArray();

  return chats.map((chat) => {
    return {
      _id: chat._id.toString(),
      users: chat.users,
      messages: chat.messages,
      name: chat.name,
    };
  });
};

const getById = async (id: string): Promise<ChatModel | null> => {
  const collection = await dbService.getCollection("chats");
  const chat = await collection.findOne({ _id: new ObjectId(id) });

  if (!chat) return null;
  return {
    _id: chat._id.toString(),
    users: chat.users,
    messages: chat.messages,
    name: chat.name,
  };
};

const create = async (chat: ChatModel): Promise<ChatModel> => {
  const collection = await dbService.getCollection("chats");

  const result = await collection.insertOne({
    ...chat,
    _id: new ObjectId(chat._id),
  });

  return {
    ...chat,
    _id: result.insertedId.toString(),
  };
};

const update = async (
  id: string,
  updateData: Partial<ChatModel>
): Promise<ChatModel | null> => {
  const collection = await dbService.getCollection("chats");
  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { ...updateData, updatedAt: new Date() } }
  );

  if (!result) return null;
  return {
    _id: result.value._id.toString(),
    users: result.value.users,
    messages: result.value.messages,
    name: result.value.name,
  };
};

const remove = async (id: string): Promise<boolean> => {
  const collection = await dbService.getCollection("chats");
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
};

export const chatService = {
  query,
  getById,
  create,
  update,
  remove,
};
