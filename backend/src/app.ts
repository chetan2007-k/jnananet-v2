import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import apiRouter from "./routes";
import { errorHandler } from "./middleware/errorHandler";
import { globalRateLimiter } from "./middleware/rateLimiter";
import { sendError } from "./utils/apiResponse";

export const createApp = (): Application => {
  const app: Application = express();

  // Security Headers
  app.use(helmet());

  // CORS Configuration
  const allowedOrigins = env.CORS_ORIGIN.split(",").map((o) => o.trim());
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin) || env.NODE_ENV === "development") {
          callback(null, true);
        } else {
          callback(new Error("CORS Policy Restriction"));
        }
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  // Rate Limiting
  app.use(globalRateLimiter);

  // Body & Cookie Parsers
  app.use(express.json({ limit: "5mb" }));
  app.use(express.urlencoded({ extended: true, limit: "5mb" }));
  app.use(cookieParser());

  // Request Logging
  if (env.NODE_ENV !== "test") {
    app.use(morgan("dev"));
  }

  // Mount API Router
  app.use(env.API_PREFIX, apiRouter);

  // 404 Handler
  app.use((req, res) => {
    return sendError(res, `Route ${req.originalUrl} not found`, 404, "ROUTE_NOT_FOUND");
  });

  // Global Error Handler
  app.use(errorHandler as any);

  return app;
};
