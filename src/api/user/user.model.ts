export interface UserModel extends UserToCreate {
  _id: string;
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
