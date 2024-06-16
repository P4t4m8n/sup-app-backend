export interface MessageModel extends MassageToCreate {
  _id: string;
}

export interface MassageToCreate {
  text: string;
  userId: string;
  createAt: number;
  updatedAt?: number | null;
  chatId: string;
}
