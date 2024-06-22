import { ObjectId } from "mongodb";

export interface UserModel extends UserToCreate {
  _id: ObjectId;
  updatedAt?: number | null;
}


export interface UserToCreate {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password?: string;
  createAt: number;
}

export interface UserSmallModel {
  _id: ObjectId;
  username: string;
}
