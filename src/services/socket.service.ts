import { Server, Socket } from "socket.io";
import { messagesService } from "../api/messages/messages.service";
import { socketAuthMiddleware } from "../middlewares/socketAuthMiddleware";
import { chatService } from "../api/chat/chat.service";
import { ChatType } from "../api/chat/chat.model";

export const setUpSocketAPI = (server: any) => {
  const gIo = new Server(server, {
    cors: {
      origin: "http://localhost:4200",
      credentials: true,
    },
  });

  interface User {
    [key: string]: string;
  }

  const users: User = {};

  gIo.use(socketAuthMiddleware);

  gIo.on("connect", (socket: Socket) => {
    const userId = socket.data.userId;
    console.log(`User connected [id: ${socket.id}, userId: ${userId}]`);
    users[userId] = socket.id;

    socket.on("disconnect", () => {
      console.log(`User disconnected [id: ${socket.id}]`);
      delete users[userId];
    });

    socket.on(
      "startChat",
      async ({
        recipientId,
        type,
        name,
      }: {
        recipientId: string;
        type: ChatType;
        name: string;
      }) => {
        const userIds = [userId, recipientId];
        let chat = await chatService.findChatByUsers(userIds);

        if (!chat) {
          chat = await chatService.create(userIds, type, name);
        }

        const chatId = chat._id.toString();
        socket.join(chatId);

        if (users[recipientId]) {
          gIo.to(users[recipientId]).emit("chatStarted", {
            chat,
          });
        }

        if (users[userId]) {
          gIo.to(users[userId]).emit("chatStarted", {
            chat,
          });
        }
      }
    );

    socket.on(
      "sendMessage",
      async ({ chatId, message }: { chatId: string; message: string }) => {
        const newMessage = await messagesService.create(
          chatId,
          userId,
          message
        );
        gIo.to(chatId).emit("message", newMessage);
      }
    );

    socket.on("fetchMessages", async ({ chatId }: { chatId: string }) => {
      const messages = await messagesService.queryByChat(chatId);
      socket.emit("messages", messages);
    });

    socket.on("joinChat", (chatId: string) => {
      socket.join(chatId);
    });
  });
};
