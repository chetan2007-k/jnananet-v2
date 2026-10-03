import { PrismaClient } from "@prisma/client";
import { logger } from "../utils/logger";

let prisma: PrismaClient;

try {
  prisma = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
} catch (error) {
  logger.error("Failed to initialize Prisma Client", error);
  prisma = new PrismaClient();
}

export { prisma };
