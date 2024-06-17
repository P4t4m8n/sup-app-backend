import { Request, Response } from "express";
import { authService } from "./auth.service";
import { sessionService } from "../../services/session.service";

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const user = await authService.login(username, password);
    const session = await sessionService.createSession(user._id);
    res.cookie("sessionId", session, { httpOnly: true });
    res.json(user);
  } catch (err) {
    res.status(401).send({ err: "Failed to Login" });
  }
};

export const signup = async (req: Request, res: Response) => {
  const user = req.body;
  try {
    const newUser = await authService.signup(user);
    const loginUser = await authService.login(
      newUser.username,
      newUser.password!
    );
    const session = await sessionService.createSession(loginUser._id);
    res.cookie("sessionId", session._id, { httpOnly: true });
    res.json(loginUser);
  } catch (err) {
    res.status(400).send({ err: "Failed to Signup" });
  }
};

export const logout = async (req: Request, res: Response) => {
  const sessionId = req.cookies.sessionId;

  try {
    if (sessionId) {
      await sessionService.deleteSession(sessionId);
      res.clearCookie("sessionId");
    }
    res.send({ msg: "Logged out" });
  } catch (err) {
    res.status(500).send({ err: "Failed to logout" });
  }
};
