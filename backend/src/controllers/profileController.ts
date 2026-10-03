import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth";
import {
  ProfileService,
  updateAcademicSchema,
  updateFinancialSchema,
  updatePersonalSchema,
} from "../services/profileService";
import { sendSuccess } from "../utils/apiResponse";

export class ProfileController {
  static async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const profile = await ProfileService.getProfileByUserId(userId);
      return sendSuccess(res, profile);
    } catch (error) {
      next(error);
    }
  }

  static async updatePersonal(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const validated = updatePersonalSchema.parse(req.body);
      const updated = await ProfileService.updatePersonal(userId, validated);
      return sendSuccess(res, updated);
    } catch (error) {
      next(error);
    }
  }

  static async updateAcademic(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const validated = updateAcademicSchema.parse(req.body);
      const updated = await ProfileService.updateAcademic(userId, validated);
      return sendSuccess(res, updated);
    } catch (error) {
      next(error);
    }
  }

  static async updateFinancial(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const validated = updateFinancialSchema.parse(req.body);
      const updated = await ProfileService.updateFinancial(userId, validated);
      return sendSuccess(res, updated);
    } catch (error) {
      next(error);
    }
  }

  static async getStrength(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const strength = await ProfileService.calculateProfileStrength(userId);
      return sendSuccess(res, strength);
    } catch (error) {
      next(error);
    }
  }
}
