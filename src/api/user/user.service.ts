import { ObjectId } from "mongodb";
import { dbService } from "../../services/db.service";
import { UserModel, UserSmallModel, UserToCreate } from "./user.model";

const query = async (filterSortBy= {}): Promise<UserModel[]> => {
  const collection = await dbService.getCollection("users");

  const users = await collection.find().sort({}).toArray();
  const fixedUsers = users.map((user) => {
    delete user.password;
    return {
      _id: user._id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      createAt: user.createAt,
      imgUrl: user.imgUrl,
    };
  });

  return fixedUsers;
};

const getById = async (id: string | ObjectId): Promise<UserModel | null> => {
  const collection = await dbService.getCollection("users");
  const user = await collection.findOne({ _id: new ObjectId(id) });

  if (user) {
    delete user.password;
    return {
      _id: user._id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      createAt: user.createAt,
      imgUrl: user.imgUrl,
    };
  }

  return null;
};

const getByUsername = async (username: string): Promise<UserModel | null> => {
  const collection = await dbService.getCollection("users");
  const result = await collection.findOne({ username });
  if (!result) {
    return null;
  }

  const user = {
    _id: result._id,
    email: result.email,
    password: result.password,
    username: result.username,
    firstName: result.firstName,
    lastName: result.lastName,
    createAt: result.createAt,
    imgUrl: result.imgUrl,
  };
  return user;
};

const create = async (user: UserToCreate): Promise<UserModel> => {
  const collection = await dbService.getCollection("users");
  const userExists = await collection.findOne({
    $or: [{ email: user.email }, { username: user.username }],
  });

  if (userExists) {
    throw new Error("User already exists");
  }
  const result = await collection.insertOne({
    ...user,
  });

  return {
    _id: result.insertedId,
    email: user.email,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    createAt: user.createAt,

    imgUrl: user.imgUrl,
  };
};

const update = async (user: UserModel): Promise<UserModel | null> => {
  const collection = await dbService.getCollection("users");
  const result = await collection.updateOne(
    { _id: new ObjectId(user._id) },
    {
      $set: {
        user,
      },
    }
  );

  if (result.modifiedCount === 1) {
    return user;
  }
  return null;
};

const remove = async (id: string): Promise<boolean> => {
  const collection = await dbService.getCollection("users");
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
};

const isUserExists = async (
  username: string,
  email: string
): Promise<boolean> => {
  const collection = await dbService.getCollection("users");
  const result = await collection.findOne({ $or: [{ email }, { username }] });
  return !!result;
};

const getUsersForFriendList = async (
  str: string
): Promise<UserSmallModel[]> => {
  const collection = await dbService.getCollection("users");
  const users = await collection
    .find({ username: { $regex: str, $options: "i" } })
    .toArray();
  return users.map((user) => {
    return {
      _id: user._id,
      username: user.username,
      imgUrl: user.imgUrl,
    };
  });
};

export const userService = {
  query,
  getById,
  create,
  update,
  remove,
  getByUsername,
  isUserExists,
  getUsersForFriendList
};
