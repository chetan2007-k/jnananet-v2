import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { sendError } from "../utils/apiResponse";

export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: "STUDENT" | "ADMIN" | "REVIEWER";
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) {
    return sendError(res, "Access token is required", 401, "UNAUTHORIZED");
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as AuthenticatedUser;
    req.user = decoded;
    next();
  } catch (error) {
    return sendError(res, "Invalid or expired access token", 401, "TOKEN_EXPIRED");
  }
}

export function requireRole(allowedRoles: Array<"STUDENT" | "ADMIN" | "REVIEWER">) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, "Authentication required", 401, "UNAUTHORIZED");
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendError(res, "Insufficient privileges to perform this action", 403, "FORBIDDEN");
    }

    next();
  };
}
