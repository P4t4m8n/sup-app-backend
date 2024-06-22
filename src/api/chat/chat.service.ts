import { ObjectId } from "mongodb";
import { dbService } from "../../services/db.service";
import { ChatToSave, ChatModel, ChatType } from "./chat.model";

const query = async (userId: string): Promise<ChatModel[]> => {
  const collection = await dbService.getCollection("chats");
  const pipeline = pipelineMany(new ObjectId(userId));

  const chats: ChatModel[] | null = (await collection
    .aggregate(pipeline)
    .toArray()) as ChatModel[] | null;
  if (!chats) return [];
  return chats.map((chat) => {
    return {
      _id: chat._id,
      name: chat.name,
      users: chat.users,
      messages: chat.messages || [],
      type: chat.type,
    };
  });
};

const getById = async (id: string): Promise<ChatModel | null> => {
  const collection = await dbService.getCollection("chats");
  const chat = await collection.findOne({ _id: new ObjectId(id) });

  if (!chat) return null;
  return {
    _id: chat._id,
    users: chat.users,
    name: chat.name,
    type: chat.type,
  };
};

const create = async (
  userIds: string[],
  type: ChatType,
  name: string
): Promise<ChatModel> => {
  const collection = await dbService.getCollection("chats");
  const chatToSave = buildChatToSave(userIds, type, name);
  const result = await collection.insertOne({ ...chatToSave });
  const pipeline = pipelineOne(result.insertedId);
  const chat = await collection.aggregate(pipeline).toArray();

  return {
    _id: chat[0]._id.toString(),
    name: chat[0].name,
    users: chat[0].users,
    messages: chat[0].messages || [],
    type: chat[0].type,
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
    _id: result.value._id,
    users: result.value.users,
    name: result.value.name,
    type: result.value.type,
  };
};

const remove = async (id: string): Promise<boolean> => {
  const collection = await dbService.getCollection("chats");
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
};

const findChatByUsers = async (
  userIds: string[]
): Promise<ChatModel | null> => {
  const collection = await dbService.getCollection("chats");
  const chat = await collection.findOne({ users: { $all: userIds } });

  if (!chat) return null;
  return {
    _id: chat._id,
    users: chat.users,
    name: chat.name,
    type: chat.type,
  };
};

const pipelineMany = (userId: ObjectId) => [
  // Match chats that include the given userId
  {
    $match: { users: userId },
  },

  // Lookup messages related to each chat using string fields
  {
    $lookup: {
      from: "messages",
      localField: "_id",
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
            message: "$$message.message",
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

  // Lookup users related to each chat
  {
    $lookup: {
      from: "users",
      localField: "userIds",
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
        username: 1,
      },
      messages: 1,
    },
  },
];

const pipelineOne = (chatId: ObjectId) => [
  {
    $match: { _id: chatId },
  },
  {
    $lookup: {
      from: "messages",
      localField: "_id",
      foreignField: "chatId",
      as: "messages",
    },
  },
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
  {
    $unwind: "$users",
  },
  {
    $lookup: {
      from: "users",
      localField: "users", // This should be 'users', which contains user IDs
      foreignField: "_id",
      as: "userObjects",
    },
  },
  {
    $group: {
      _id: "$_id",
      name: { $first: "$name" },
      messages: { $first: "$messages" },
      users: { $push: { $arrayElemAt: ["$userObjects", 0] } },
    },
  },
  {
    $project: {
      _id: 1,
      name: 1,
      users: {
        _id: 1,
        username: 1,
      },
      messages: 1,
    },
  },
];

const buildChatToSave = (
  userIds: string[],
  type: ChatType | undefined,
  name: string | undefined
): ChatToSave => {
  const objectUserIds = userIds.map((userId) => new ObjectId(userId));
  return {
    users: objectUserIds,
    name: name || "",
    type: type || "private",
  };
};

export const chatService = {
  query,
  getById,
  create,
  update,
  remove,
  findChatByUsers,
};
