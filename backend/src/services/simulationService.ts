import { prisma } from "../config/prisma";
import { EligibilityEngine } from "./eligibilityEngine";

export interface SimulationInput {
  userId: string;
  simulatedMarks?: number;
  simulatedIncome?: number;
  simulatedCourse?: string;
}

export class SimulationService {
  static async runWhatIfSimulation(input: SimulationInput) {
    const profile = await prisma.studentProfile.findUnique({
      where: { userId: input.userId },
      include: { academicRecord: true, financialProfile: true },
    });

    if (!profile) {
      throw new Error("Student profile not found");
    }

    const currentMarks = profile.academicRecord?.scoreObtained || 70.0;
    const currentIncome = profile.financialProfile?.annualFamilyIncome || 300000.0;
    const currentCourse = profile.academicRecord?.courseName || "B.Tech";

    const targetMarks = input.simulatedMarks ?? currentMarks;
    const targetIncome = input.simulatedIncome ?? currentIncome;
    const targetCourse = input.simulatedCourse ?? currentCourse;

    const scholarships = await prisma.scholarship.findMany({
      where: { isActive: true },
      include: { criteria: true },
    });

    const baselineMatches: any[] = [];
    const simulatedMatches: any[] = [];

    for (const scholarship of scholarships) {
      const criteria = scholarship.criteria[0] || {
        minAcademicScore: 0,
        maxFamilyIncome: 999999999,
        allowedCourses: ["ALL"],
        allowedStates: ["ALL"],
        allowedCategories: ["ALL"],
        genderRestriction: "ALL",
      };

      const scholarshipFormat = {
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
      };

      // Baseline evaluation
      const baseline = EligibilityEngine.evaluate(
        {
          fullName: profile.fullName,
          gender: profile.gender,
          category: profile.category,
          state: profile.state,
          district: profile.district,
          scoreObtained: currentMarks,
          courseName: currentCourse,
          annualFamilyIncome: currentIncome,
        },
        scholarshipFormat
      );
      baselineMatches.push(baseline);

      // Simulated evaluation
      const sim = EligibilityEngine.evaluate(
        {
          fullName: profile.fullName,
          gender: profile.gender,
          category: profile.category,
          state: profile.state,
          district: profile.district,
          scoreObtained: targetMarks,
          courseName: targetCourse,
          annualFamilyIncome: targetIncome,
        },
        scholarshipFormat
      );
      simulatedMatches.push(sim);
    }

    const baselineEligibleCount = baselineMatches.filter((m) => m.isEligible).length;
    const simulatedEligibleCount = simulatedMatches.filter((m) => m.isEligible).length;
    const unlockedScholarships = simulatedMatches.filter(
      (sim) => sim.isEligible && !baselineMatches.find((b) => b.scholarshipId === sim.scholarshipId)?.isEligible
    );

    return {
      baseline: {
        marks: currentMarks,
        income: currentIncome,
        course: currentCourse,
        eligibleCount: baselineEligibleCount,
      },
      simulated: {
        marks: targetMarks,
        income: targetIncome,
        course: targetCourse,
        eligibleCount: simulatedEligibleCount,
      },
      deltaEligibleCount: simulatedEligibleCount - baselineEligibleCount,
      unlockedScholarships,
    };
  }
}
