import { userService } from "../user/user.service";
import Cryptr from "cryptr";
import bcrypt from "bcrypt";
import { UserModel } from "../user/user.model";
import { SessionModel } from "./auth.model";

export const cryptr = new Cryptr("smelly-Puk-030");

const login = async (
  username: string,
  password: string
): Promise<UserModel> => {
  const user = await userService.getByUsername(username);
  if (!user || !user.password) {
    throw new Error("Invalid username or password");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new Error("Invalid username or password");
  }

  delete user.password;
  return user;
};

const signup = async (user: UserModel): Promise<UserModel> => {
  const saltRounds = 10;
  if (!user.password || !user.username) {
    throw new Error("Missing details");
  }
  
  const userExists = await userService.isUserExists(user.username, user.email);

  if (userExists) {
    throw new Error("User already exists");
  }

  const hash = await bcrypt.hash(user.password, saltRounds);
  return userService.create({ ...user, password: hash });
};

const getLoginToken = (user: UserModel): string => {
  const userInfo = {
    _id: user._id,
    username: user.username,
  };
  return cryptr.encrypt(JSON.stringify(userInfo));
};

const validateToken = (token: string): SessionModel => {
  const decrypted = cryptr.decrypt(token);
  return JSON.parse(decrypted);
};

export const authService = {
  login,
  signup,
  getLoginToken,
  validateToken,
};
