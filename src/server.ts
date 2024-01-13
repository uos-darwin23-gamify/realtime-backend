import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import railsController from "./controllers/rails";

// const whitelistCors = [
//   "http://localhost:3000",
//   "http://localhost:5173",
//   "https://gamifycoding.me",
//   "ws://localhost:3000",
//   "ws://localhost:5173",
//   "wss://gamifycoding.me",
// ];

const app = express();
const server = createServer(app);
app.use(cors());

const io = new Server(server, {
  path: "/socket",
  cors: { origin: "*" },
});

app.use("/api", railsController(io));

const PORT =
  (process.env.PORT !== undefined && parseInt(process.env.PORT)) || 4000;

server.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
