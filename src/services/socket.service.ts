import { Server, Socket } from "socket.io";
import { messagesService } from "../api/messages/messages.service";
import { MessagesToCreate } from "../api/messages/messages.model";

export const setUpSocketAPI = (server: any) => {
  let gIo = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  gIo.on("connection", (socket: Socket) => {
    console.log("New client connected");

    socket.on("message", async (message: MessagesToCreate) => {
      const newMessage = {
        userId: message.userId,
        chatId: message.chatId,
        text: message.text,
        senderUserName: message.senderUserName,
      };
      const savedMessage = await messagesService.create(newMessage);
      gIo.emit("message", savedMessage);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
};
