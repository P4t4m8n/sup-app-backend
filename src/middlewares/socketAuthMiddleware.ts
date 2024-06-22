import { Socket } from "socket.io";
import { sessionService } from "../services/session.service";
import { authService } from "../api/auth/auth.service";

export const socketAuthMiddleware = async (
  socket: Socket,
  next: (err?: Error) => void
) => {
  const sessionId =
  
  socket.handshake.headers.cookie?.split("sessionId=")[1];

  if (!sessionId) {
    return next(new Error("You must be logged in"));
  }

  const session =  authService.validateToken(sessionId);
  if (!session) {
    return next(new Error("Invalid or expired session"));
  }

  socket.data.userId = session.userId;
  next();
};
