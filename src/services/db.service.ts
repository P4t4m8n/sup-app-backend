import { MongoClient, Db, Collection } from "mongodb";

let dbConnection: Db | null = null;

const getCollection = async (
  collectionName: "massages" | "users"|"sessions"
): Promise<Collection> => {
  const db = await _connect();
  return db.collection(collectionName);
};

const _connect = async (): Promise<Db> => {
  if (dbConnection) {
    return dbConnection;
  }
  const client = await MongoClient.connect(process.env.MONGO_URI!);
  dbConnection = client.db(process.env.DB_NAME!);
  return dbConnection;
};

export const dbService = {
  getCollection,
};
