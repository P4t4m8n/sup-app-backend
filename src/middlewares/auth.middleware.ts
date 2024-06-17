import { Request, Response, NextFunction } from "express";
import { sessionService } from "../services/session.service";

interface CustomRequest extends Request {
  session: any;
}

export const requireAuth = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const sessionId = req.cookies.sessionId;
  if (!sessionId) {
    return res.status(401).send({ error: "You must be logged in" });
  }
  const session = await sessionService.validateSession(sessionId);
  if (!session) {
    return res.status(401).send({ error: "Invalid or expired session" });
  }
  req.session = session;
  next();
};
