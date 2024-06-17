import { ObjectId } from "mongodb";
import { dbService } from "../../services/db.service";
import { ChatModel } from "./chat.model";

const query = async (userId: string): Promise<any[]> => {
  const collection = await dbService.getCollection("chats");
  const pipeline = getPipeline(userId); 
  console.log("userId:", userId)

  const chats = await collection.aggregate(pipeline).toArray();
  console.log("chats:", chats)

  return chats.map((chat) => {
    return {
      _id: chat._id.toString(), 
      name: chat.name,
      users: chat.users, 
      messages: chat.messages, 
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
    name: result.value.name,
  };
};

const remove = async (id: string): Promise<boolean> => {
  const collection = await dbService.getCollection("chats");
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
};

const getPipeline = (userId: string) => [
  {
    $match: { users: userId },
  },
  {
    $lookup: {
      from: "Messages",
      localField: "_id",
      foreignField: "chatId",
      as: "messages",
    },
  },
  {
    $unwind: "$users",
  },
  {
    $lookup: {
      from: "Users",
      localField: "users", 
      foreignField: "_id",
      as: "users",
    },
  },
  {
    // Project desired fields (optional)
    $project: {
      _id: 1, // Include other chat fields as needed
      name: 1, // Optional: Chat name
      users: "$users", // Array of user objects
      messages: 1,
    },
  },
];

export const chatService = {
  query,
  getById,
  create,
  update,
  remove,
};
