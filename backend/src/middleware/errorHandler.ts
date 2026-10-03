import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { sendError } from "../utils/apiResponse";
import { logger } from "../utils/logger";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): Response {
  logger.error(`Error on ${req.method} ${req.originalUrl}:`, err);

  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join("."),
      issue: e.message,
    }));
    return sendError(res, "Validation failed", 400, "VALIDATION_ERROR", formattedErrors);
  }

  if (err.name === "UnauthorizedError" || err.status === 401) {
    return sendError(res, err.message || "Unauthorized access", 401, "UNAUTHORIZED");
  }

  if (err.code === "P2002") {
    return sendError(res, "A record with this unique attribute already exists", 409, "DUPLICATE_ENTRY");
  }

  const message = process.env.NODE_ENV === "production" ? "Internal server error" : err.message;
  return sendError(res, message || "An unexpected error occurred", 500, "INTERNAL_SERVER_ERROR");
}
