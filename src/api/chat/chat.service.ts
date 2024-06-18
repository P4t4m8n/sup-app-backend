import { ObjectId } from "mongodb";
import { dbService } from "../../services/db.service";
import { ChatModel } from "./chat.model";
import { send } from "process";

const query = async (userId: string): Promise<any[]> => {
  const collection = await dbService.getCollection("chats");
  const pipeline = getPipeline(userId);

  const chats = await collection.aggregate(pipeline).toArray();
  console.log("chats:", chats);

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
  // Match chats that include the given userId
  {
    $match: { users: userId },
  },
  // Convert `_id` to string to match `chatId` in messages
  {
    $addFields: {
      chatIdString: { $toString: "$_id" },
    },
  },
  // Lookup messages related to each chat using string fields
  {
    $lookup: {
      from: "messages",
      localField: "chatIdString",
      foreignField: "chatId",
      as: "messages",
    },
  },
  // Add a field to convert message _id to date
  {
    $addFields: {
      messages: {
        $map: {
          input: "$messages",
          as: "message",
          in: {
            _id: "$$message._id",
            text: "$$message.text",
            userId: "$$message.userId",
            chatId: "$$message.chatId",
            senderUserName: "$$message.senderUserName",
            createAt: { $toDate: "$$message._id" }, // Extract creation date from _id
          },
        },
      },
    },
  },
  // Preserve the original users array
  {
    $addFields: {
      userIds: "$users",
    },
  },
  // Unwind the users array to perform lookup on individual user IDs
  {
    $unwind: "$userIds",
  },
  // Convert userId to ObjectId for matching with users collection
  {
    $addFields: {
      userIdObject: { $toObjectId: "$userIds" },
    },
  },
  // Lookup users related to each chat
  {
    $lookup: {
      from: "users",
      localField: "userIdObject",
      foreignField: "_id",
      as: "userObjects",
    },
  },
  // Group back the users to form an array
  {
    $group: {
      _id: "$_id",
      name: { $first: "$name" },
      messages: { $first: "$messages" },
      users: { $push: { $arrayElemAt: ["$userObjects", 0] } },
    },
  },
  // Final projection to clean up the output
  {
    $project: {
      _id: 1,
      name: 1,
      users: {
        _id: 1,
        email: 1,
        username: 1,
        firstName: 1,
        lastName: 1,
      },
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
