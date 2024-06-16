import { Request, Response } from "express";
import { authService } from "./auth.service";

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const user = await authService.login(username, password);
    const token = authService.getLoginToken(user);
    res.cookie("loginToken", token, { sameSite: "none", secure: true });

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
    const loginToken = authService.getLoginToken(loginUser);

    res.cookie("loginToken", loginToken);
    res.json(loginUser);
  } catch (err) {
    res.status(400).send({ err: "Failed to Signup" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("loginToken");
    res.send({ msg: "Logged out" });
  } catch (err) {
    res.status(500).send({ err: "Failed to logout" });
  }
};
