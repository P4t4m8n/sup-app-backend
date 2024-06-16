import express from "express";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

const app = express();
const server = http.createServer(app);

app.use(cookieParser());
app.use(express.json());

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.resolve("public")));
} else {
  const corsOptions = {
    origin: [
      "http://127.0.0.1:4200",
      "http://localhost:4200",
      "http://127.0.0.1:3000",
      "http://localhost:3000",
      "http://127.0.0.1:8080",
      "http://localhost:8080",
    ],
    credentials: true,
  };
  app.use(cors(corsOptions));
}

//Routes
import { authRoutes } from "./api/auth/auth.routes";
app.use("/api/auth", authRoutes);

import { userRoutes } from "./api/user/user.routes";
app.use("/api/user", userRoutes);

import { massageRoutes } from "./api/messages/messages.routes";
app.use("/api/station", massageRoutes);

import { setUpSocketAPI } from "./services/socket.service";
setUpSocketAPI(server);

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log("Server is running on port: " + port);
});
