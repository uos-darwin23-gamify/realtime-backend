import Router from "express";
import { Server } from "socket.io";
import { Events } from "../types/Events.js";
import cookie from "cookie";
import { getUserType } from "../utils";

const createRouter = (io: Server) => {
  io.on("connection", (socket: Events) => {
    const cookies =
      socket.handshake.headers.cookie !== undefined &&
      cookie.parse(socket.handshake.headers.cookie);

    let accessToken: string | undefined = undefined;
    let sessionId: string | undefined = undefined;

    if (cookies !== false) {
      accessToken = cookies.access_token;
      sessionId = cookies._session_id;
    }

    socket.on("custom event 1", (callback: () => void) => {
      callback();
    });

    getUserType(accessToken || "").then((userType) =>
      io.emit("user-type", { userType })
    );

    // socket.on("disconnect", () => console.log("disconnected"));
  });

  const router = Router();
  router.get("/", (req, res) => res.send({ status: "OK" }));

  return router;
};

export default createRouter;
