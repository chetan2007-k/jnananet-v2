import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth";
import { prisma } from "../config/prisma";
import { EligibilityEngine } from "../services/eligibilityEngine";
import { SimulationService } from "../services/simulationService";
import { sendSuccess } from "../utils/apiResponse";

export class EligibilityController {
  static async evaluate(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { scholarshipId } = req.body;

      const profile = await prisma.studentProfile.findUnique({
        where: { userId },
        include: { academicRecord: true, financialProfile: true },
      });

      if (!profile) {
        throw new Error("Student profile not found");
      }

      let scholarships: any[] = [];
      if (scholarshipId) {
        const s = await prisma.scholarship.findUnique({
          where: { id: scholarshipId },
          include: { criteria: true },
        });
        if (s) scholarships.push(s);
      } else {
        scholarships = await prisma.scholarship.findMany({
          where: { isActive: true },
          include: { criteria: true },
        });
      }

      const results = scholarships.map((scholarship: any) => {
        const criteria = scholarship.criteria[0] || {
          minAcademicScore: 0,
          maxFamilyIncome: 999999999,
          allowedCourses: ["ALL"],
          allowedStates: ["ALL"],
          allowedCategories: ["ALL"],
          genderRestriction: "ALL",
        };

        return EligibilityEngine.evaluate(
          {
            fullName: profile.fullName,
            gender: profile.gender,
            category: profile.category,
            state: profile.state,
            district: profile.district,
            scoreObtained: profile.academicRecord?.scoreObtained || 0,
            courseName: profile.academicRecord?.courseName || "B.Tech",
            annualFamilyIncome: profile.financialProfile?.annualFamilyIncome || 0,
          },
          {
            id: scholarship.id,
            title: scholarship.title,
            provider: scholarship.provider,
            awardAmount: scholarship.awardAmount,
            criteria: {
              minAcademicScore: criteria.minAcademicScore,
              maxFamilyIncome: criteria.maxFamilyIncome,
              allowedCourses: (criteria.allowedCourses as string[]) || ["ALL"],
              allowedStates: (criteria.allowedStates as string[]) || ["ALL"],
              allowedCategories: (criteria.allowedCategories as string[]) || ["ALL"],
              genderRestriction: criteria.genderRestriction as any,
            },
          }
        );
      });

      return sendSuccess(res, results);
    } catch (error) {
      next(error);
    }
  }

  static async simulate(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { simulatedMarks, simulatedIncome, simulatedCourse } = req.body;

      const result = await SimulationService.runWhatIfSimulation({
        userId,
        simulatedMarks,
        simulatedIncome,
        simulatedCourse,
      });

      return sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }
}
