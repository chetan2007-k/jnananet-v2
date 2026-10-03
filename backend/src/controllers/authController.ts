import { Request, Response, NextFunction } from "express";
import { AuthService, loginSchema, registerSchema } from "../services/authService";
import { sendSuccess, sendError } from "../utils/apiResponse";

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedInput = registerSchema.parse(req.body);
      const result = await AuthService.register(validatedInput);

      // Set Refresh Token in HttpOnly Secure Cookie
      res.cookie("refreshToken", result.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return sendSuccess(res, {
        user: result.user,
        accessToken: result.tokens.accessToken,
      }, 201);
    } catch (error: any) {
      if (error.message === "An account with this email already exists") {
        return sendError(res, error.message, 409, "DUPLICATE_EMAIL");
      }
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedInput = loginSchema.parse(req.body);
      const result = await AuthService.login(validatedInput);

      res.cookie("refreshToken", result.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return sendSuccess(res, {
        user: result.user,
        accessToken: result.tokens.accessToken,
      });
    } catch (error: any) {
      if (error.message === "Invalid email or password") {
        return sendError(res, error.message, 401, "INVALID_CREDENTIALS");
      }
      next(error);
    }
  }

  static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
      if (!refreshToken) {
        return sendError(res, "Refresh token required", 401, "REFRESH_TOKEN_REQUIRED");
      }

      const result = await AuthService.verifyRefreshToken(refreshToken);
      return sendSuccess(res, result);
    } catch (error: any) {
      return sendError(res, error.message || "Invalid refresh token", 401, "INVALID_REFRESH_TOKEN");
    }
  }

  static async logout(req: Request, res: Response) {
    res.clearCookie("refreshToken");
    return sendSuccess(res, { message: "Successfully logged out" });
  }
}
