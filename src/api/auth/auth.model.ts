import { ObjectId } from "mongodb";

export interface SessionModel extends SessionSmallModel {
  userId: ObjectId;
  createdAt: Date;
}

export interface SessionSmallModel {
  _id?: ObjectId;
  expiresAt: Date;

}


