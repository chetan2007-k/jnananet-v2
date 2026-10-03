import rateLimit from "express-rate-limit";
import { sendError } from "../utils/apiResponse";

export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    sendError(res, "Too many requests from this IP, please try again later", 429, "RATE_LIMIT_EXCEEDED");
  },
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit auth attempts per IP
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    sendError(res, "Too many authentication attempts, please try again later", 429, "AUTH_RATE_LIMIT_EXCEEDED");
  },
});
