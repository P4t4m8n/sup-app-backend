import { Server, Socket } from "socket.io";
import { messagesService } from "../api/messages/messages.service";

export const setUpSocketAPI = (server: any) => {
  let gIo = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  gIo.on("connection", (socket: Socket) => {
    console.log("New client connected");

    socket.on("message", async (text: string) => {
      const newMessage = {
        userId: "",
        chatId: "",
        text,
        senderUserName: "Anonymous",
      };
      await messagesService.create(newMessage);
      gIo.emit("message", newMessage);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
};


