import { Session } from "inspector";

export interface SessionModel extends SessionSmallModel {
  userId: string;
  createdAt: Date;
}

export interface SessionSmallModel {
  _id?: string;
  expiresAt: Date;

}


