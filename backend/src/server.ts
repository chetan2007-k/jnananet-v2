import { createApp } from "./app";
import { env } from "./config/env";
import { logger } from "./utils/logger";

const app = createApp();

const server = app.listen(env.PORT, () => {
  logger.info(`🚀 JnanaNet V2 Backend Server started on port ${env.PORT}`);
  logger.info(`📍 API Base Endpoint: http://localhost:${env.PORT}${env.API_PREFIX}`);
  logger.info(`🛡️ Environment: ${env.NODE_ENV}`);
});

process.on("unhandledRejection", (reason: any) => {
  logger.error("Unhandled Rejection:", reason);
});

process.on("uncaughtException", (error: Error) => {
  logger.error("Uncaught Exception:", error);
  process.exit(1);
});

export default server;
