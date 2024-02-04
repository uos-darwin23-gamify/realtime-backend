import * as Sentry from "@sentry/node";
import { ProfilingIntegration } from "@sentry/profiling-node";
import express, { Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import railsController from "./controllers/rails";

interface ResponseWithSentry extends Response {
  sentry: string;
}

// const whitelistCors = [
//   "http://localhost:3000",
//   "http://localhost:5173",
//   "https://gamifycoding.me",
//   "ws://localhost:3000",
//   "ws://localhost:5173",
//   "wss://gamifycoding.me",
// ];

const app = express();

process.env.NODE_ENV === "production" &&
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
      // enable HTTP calls tracing
      new Sentry.Integrations.Http({ tracing: true }),
      // enable Express.js middleware tracing
      new Sentry.Integrations.Express({ app }),
      new ProfilingIntegration(),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Set sampling rate for profiling - this is relative to tracesSampleRate
    profilesSampleRate: 1.0,
    enabled: process.env.NODE_ENV === "production",
  });

// The request handler must be the first middleware on the app
process.env.NODE_ENV === "production" &&
  app.use(Sentry.Handlers.requestHandler());

// TracingHandler creates a trace for every incoming request
process.env.NODE_ENV === "production" &&
  app.use(Sentry.Handlers.tracingHandler());

const server = createServer(app);
app.use(cors());

const io = new Server(server, {
  path: "/socket",
  cors: { origin: "*" },
});

app.use("/api", railsController(io));

// The error handler must be registered before any other error middleware and after all controllers
process.env.NODE_ENV === "production" &&
  app.use(Sentry.Handlers.errorHandler());

// Optional fallthrough error handler
process.env.NODE_ENV === "production" &&
  app.use(
    "*",
    function onError(
      err: any,
      req: Request,
      res: Response,
      next: NextFunction
    ): void {
      // The error id is attached to `res.sentry` to be returned
      // and optionally displayed to the user for support.
      res.statusCode = 500;
      res.end((res as ResponseWithSentry).sentry + "\n");
    }
  );

const PORT =
  (process.env.PORT !== undefined && parseInt(process.env.PORT)) || 4000;

server.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});

process.env.NODE_ENV === "production" &&
  Sentry.captureMessage(
    "New Start-Up On Production Server (realtime-backend/info)"
  );
