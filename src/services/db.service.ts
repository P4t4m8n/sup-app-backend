import { MongoClient, Db, Collection } from "mongodb";

let dbConnection: Db | null = null;

const getCollection = async (
  collectionName: "messages" | "users" | "sessions"| "chats"| "friends"
): Promise<Collection> => {
  const db = await _connect();
  return db.collection(collectionName);
};

const _connect = async (): Promise<Db> => {
  if (dbConnection) {
    return dbConnection;
  }

  const client = await MongoClient.connect("mongodb://localhost:27017");
  dbConnection = client.db("chatApp");
  return dbConnection;
};

export const dbService = {
  getCollection,
};
