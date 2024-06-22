import { SessionModel, SessionSmallModel } from "../api/auth/auth.model";
import { cryptr } from "../api/auth/auth.service";
import { dbService } from "./db.service";
import { ObjectId } from "mongodb";

const ON_DAY_SESSION_EXPIRY = 1000 * 60 * 60 * 24;

const createSession = async (userId: ObjectId): Promise<string> => {
  const collection = await dbService.getCollection("sessions");
  const session: SessionModel & { _id?: ObjectId } = {
    userId,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + ON_DAY_SESSION_EXPIRY),
  };
  const result = await collection.insertOne(session);
  return cryptr.encrypt(
    JSON.stringify({ ...session, _id: result.insertedId })
  );
};

const validateSession = async (
  sessionId: string
): Promise<SessionSmallModel | null> => {
  const collection = await dbService.getCollection("sessions");
  const sessionData = await collection.findOne({
    _id: new ObjectId(sessionId),
    expiresAt: { $gt: new Date() },
  });

  const session = {
    _id: sessionData?._id,
    expiresAt: sessionData?.expiresAt,
  };

  return session;
};

const deleteSession = async (sessionId: string): Promise<void> => {
  const collection = await dbService.getCollection("sessions");
  await collection.deleteOne({ _id: new ObjectId(sessionId) });
};

export const sessionService = {
  createSession,
  validateSession,
  deleteSession,
};
