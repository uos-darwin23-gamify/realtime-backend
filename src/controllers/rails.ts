import Router from "express";
import { Server } from "socket.io";
import { Events } from "../types/Events.js";
import cookie from "cookie";
import {
  getUserTypeAndEmail,
  registerUserConnect,
  registerUserDisconnect,
  MINIMUM_TIME_TO_REGISTER_NEW_ACTIVITY_SESSION_SECONDS,
} from "../utils";
import * as Sentry from "@sentry/node";

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

    getUserTypeAndEmail(accessToken || "").then((data) => {
      io.emit("user-type", { userType: data ? data.userType : false });
    });

    let timeoutExecuted = false;

    const timeout: ReturnType<typeof setTimeout> = setTimeout(() => {
      getUserTypeAndEmail(accessToken || "").then((data) => {
        if (data) {
          const room = io.sockets.adapter.rooms.get(data.email);

          if (!room || room.size === 0) {
            socket.join(data.email);

            registerUserConnect(accessToken || "").then((result) => {
              if (!result) {
                console.error("Failed to register user connect");
                process.env.NODE_ENV === "production" &&
                  Sentry.captureMessage("Failed to register user connect");
              }
            });

            timeoutExecuted = true;
          }
        }
      });
    }, MINIMUM_TIME_TO_REGISTER_NEW_ACTIVITY_SESSION_SECONDS * 1000);

    socket.on("disconnect", () => {
      clearTimeout(timeout);
      getUserTypeAndEmail(accessToken || "").then((data) => {
        if (data) {
          const room = io.sockets.adapter.rooms.get(data.email);

          if (!room || room.size === 0) {
            if (timeoutExecuted) {
              registerUserDisconnect(accessToken || "").then((result) => {
                if (!result) {
                  console.error("Failed to register user disconnect");
                  process.env.NODE_ENV === "production" &&
                    Sentry.captureMessage("Failed to register user disconnect");
                }
              });
            }
          }
        }
      });
    });
  });

  const router = Router();
  router.get("/", (req, res) => res.send({ status: "OK" }));

  return router;
};

export default createRouter;
