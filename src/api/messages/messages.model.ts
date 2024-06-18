export interface MessageModel extends MessagesToCreate {
  _id: string;
}

export interface MessagesToCreate {
  text: string;
  userId: string;
  updatedAt?: number | null;
  chatId: string;
  senderUserName:string

}

 
