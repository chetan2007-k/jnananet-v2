import { prisma } from "../config/prisma";
import { EligibilityEngine } from "./eligibilityEngine";

export interface ScholarshipFilterQuery {
  search?: string;
  course?: string;
  state?: string;
  category?: string;
  minIncome?: number;
  maxIncome?: number;
  minMarks?: number;
  page?: number;
  limit?: number;
}

export class ScholarshipService {
  static async getScholarships(query: ScholarshipFilterQuery) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(50, Math.max(1, query.limit || 10));
    const skip = (page - 1) * limit;

    const where: any = {
      isActive: true,
    };

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: "insensitive" } },
        { provider: { contains: query.search, mode: "insensitive" } },
        { description: { contains: query.search, mode: "insensitive" } },
      ];
    }

    const [scholarships, total] = await Promise.all([
      prisma.scholarship.findMany({
        where,
        include: {
          criteria: true,
          deadlines: {
            where: { status: "OPEN" },
            orderBy: { endDate: "asc" },
            take: 1,
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.scholarship.count({ where }),
    ]);

    return {
      scholarships,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getScholarshipById(id: string) {
    const scholarship = await prisma.scholarship.findUnique({
      where: { id },
      include: {
        criteria: true,
        deadlines: true,
      },
    });

    if (!scholarship) {
      throw new Error("Scholarship not found");
    }

    return scholarship;
  }

  static async compareScholarships(scholarshipIds: string[], userId?: string) {
    if (!Array.isArray(scholarshipIds) || scholarshipIds.length < 2 || scholarshipIds.length > 4) {
      throw new Error("Compare requires between 2 and 4 scholarship IDs");
    }

    const scholarships = await prisma.scholarship.findMany({
      where: { id: { in: scholarshipIds } },
      include: {
        criteria: true,
        deadlines: true,
      },
    });

    let studentProfile: any = null;
    if (userId) {
      studentProfile = await prisma.studentProfile.findUnique({
        where: { userId },
        include: { academicRecord: true, financialProfile: true },
      });
    }

    const matrix = scholarships.map((scholarship: any) => {
      const criteria = scholarship.criteria[0] || {
        minAcademicScore: 0,
        maxFamilyIncome: 999999999,
        allowedCourses: ["ALL"],
        allowedStates: ["ALL"],
        allowedCategories: ["ALL"],
        genderRestriction: "ALL",
      };

      let evaluation: any = null;
      if (studentProfile) {
        evaluation = EligibilityEngine.evaluate(
          {
            fullName: studentProfile.fullName,
            gender: studentProfile.gender,
            category: studentProfile.category,
            state: studentProfile.state,
            district: studentProfile.district,
            scoreObtained: studentProfile.academicRecord?.scoreObtained || 0,
            courseName: studentProfile.academicRecord?.courseName || "B.Tech",
            annualFamilyIncome: studentProfile.financialProfile?.annualFamilyIncome || 0,
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
      }

      return {
        id: scholarship.id,
        title: scholarship.title,
        provider: scholarship.provider,
        awardAmount: scholarship.awardAmount,
        awardDetails: scholarship.awardDetails,
        officialUrl: scholarship.officialUrl,
        minMarks: criteria.minAcademicScore,
        maxIncome: criteria.maxFamilyIncome,
        allowedCourses: criteria.allowedCourses,
        allowedStates: criteria.allowedStates,
        deadline: scholarship.deadlines[0]?.endDate || null,
        userEvaluation: evaluation,
      };
    });

    return matrix;
  }
}
