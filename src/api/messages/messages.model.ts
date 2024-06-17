export interface MessageModel extends MessagesToCreate {
  _id: string;
}

export interface MessagesToCreate {
  text: string;
  userId: string;
  createAt: number;
  updatedAt?: number | null;
  chatId: string;
}
