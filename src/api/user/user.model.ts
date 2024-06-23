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
  createAt?: number;
  imgUrl?: string;
}
export interface UserSmallModel {
  _id: ObjectId;
  username: string;
  imgUrl: string;

}

export interface UserFilterModel {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  createAt?: number;
  imgUrl?: string;
}
