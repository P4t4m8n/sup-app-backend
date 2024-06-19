import { ObjectId } from "mongodb";
import { dbService } from "../../services/db.service";
import { FriendModel } from "./friends.model";

const query = async (userId: string): Promise<FriendModel[]> => {
  const collection = await dbService.getCollection("friends");

  const friends = await collection.find({ userId }).toArray();

  return friends.map((friend) => {
    return {
      _id: friend._id.toString(),
      userId: friend.userId,
      friendId: friend.friendId,
      status: friend.status,
    };
  });
};

const getById = async (
  userId: string,
  friendId: string
): Promise<FriendModel | null> => {
  const collection = await dbService.getCollection("friends");

  const friend = await collection.findOne({ userId, friendId });

  if (friend) {
    return {
      _id: friend._id.toString(),
      userId: friend.userId,
      friendId: friend.friendId,
      status: friend.status,
    };
  }

  return null;
};

const create = async (friend: Partial<FriendModel>): Promise<FriendModel> => {
  const collection = await dbService.getCollection("friends");

  const friendExists = await collection.findOne({
    $and: [{ userId: friend.userId }, { friendId: friend.friendId }],
  });

  if (friendExists) {
    throw new Error("Friend already exists");
  }
  const _friend = await collection.insertOne({
    userId: friend.userId,
    friendId: friend.friendId,
    status: "pending",
  });

  if (!_friend.insertedId) {
    throw new Error("Could not create friend");
  }

  return {
    _id: _friend.insertedId.toString(),
    userId: friend.userId!,
    friendId: friend.friendId!,
    status: "pending",
  };
};

const update = async (friend: FriendModel): Promise<FriendModel> => {
  const { userId, friendId } = friend;

  const collection = await dbService.getCollection("friends");

  const result = await collection.updateOne(
    { userId: userId, friendId: friendId },
    { $set: { status: friend.status } }
  );

  if (result.modifiedCount !== 1) {
    throw new Error("Could not update friend");
  }
  return friend;
};

const remove = async (id: string): Promise<boolean> => {
  const collection = await dbService.getCollection("friends");
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
};

export const friendService = {
  query,
  getById,
  create,
  update,
  remove,
};
