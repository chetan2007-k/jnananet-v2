import { Request, Response, NextFunction } from "express";
import { ScholarshipService } from "../services/scholarshipService";
import { sendSuccess } from "../utils/apiResponse";
import { AuthRequest } from "../middleware/auth";

export class ScholarshipController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const search = req.query.search as string;
      const course = req.query.course as string;
      const state = req.query.state as string;
      const category = req.query.category as string;
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;

      const result = await ScholarshipService.getScholarships({
        search,
        course,
        state,
        category,
        page,
        limit,
      });

      return sendSuccess(res, result.scholarships, 200, result.meta);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const scholarshipId = String(req.params.id);
      const scholarship = await ScholarshipService.getScholarshipById(scholarshipId);
      return sendSuccess(res, scholarship);
    } catch (error) {
      next(error);
    }
  }

  static async compare(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const scholarshipIds = Array.isArray(req.body.scholarshipIds) ? req.body.scholarshipIds : [];
      const userId = req.user?.userId;
      const matrix = await ScholarshipService.compareScholarships(scholarshipIds, userId);
      return sendSuccess(res, matrix);
    } catch (error) {
      next(error);
    }
  }
}
