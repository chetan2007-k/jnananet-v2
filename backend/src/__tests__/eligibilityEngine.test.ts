import { describe, it, expect } from "vitest";
import {
  EligibilityEngine,
  EvaluationStudentProfile,
  EvaluationScholarship,
} from "../services/eligibilityEngine";

describe("Deterministic Eligibility Engine Unit Test Suite", () => {
  const sampleScholarship: EvaluationScholarship = {
    id: "schol-pragati-01",
    title: "AICTE Pragati Scholarship for Girls",
    provider: "AICTE",
    awardAmount: 50000,
    criteria: {
      minAcademicScore: 60.0,
      maxFamilyIncome: 800000.0,
      allowedCourses: ["B.Tech", "Engineering"],
      allowedStates: ["ALL"],
      allowedCategories: ["ALL"],
      genderRestriction: "FEMALE_ONLY",
    },
  };

  it("Should PASS eligibility for eligible female student meeting all criteria", () => {
    const student: EvaluationStudentProfile = {
      fullName: "Ananya Sharma",
      gender: "FEMALE",
      category: "GENERAL",
      state: "Tamil Nadu",
      district: "Chennai",
      scoreObtained: 85.0,
      courseName: "B.Tech Computer Science",
      annualFamilyIncome: 300000.0,
    };

    const result = EligibilityEngine.evaluate(student, sampleScholarship);

    expect(result.isEligible).toBe(true);
    expect(result.matchScore).toBeGreaterThanOrEqual(80);
    expect(result.recommendationTag).toBe("HIGH_PROBABILITY");
    expect(result.failedRules.length).toBe(0);
  });

  it("Should FAIL eligibility when academic score is below minimum threshold", () => {
    const student: EvaluationStudentProfile = {
      fullName: "Priya Kumar",
      gender: "FEMALE",
      category: "GENERAL",
      state: "Karnataka",
      district: "Bengaluru",
      scoreObtained: 55.0, // Below 60%
      courseName: "B.Tech",
      annualFamilyIncome: 200000.0,
    };

    const result = EligibilityEngine.evaluate(student, sampleScholarship);

    expect(result.isEligible).toBe(false);
    expect(result.failedRules.some((r) => r.includes("Academic score (55%) is below required minimum"))).toBe(true);
  });

  it("Should FAIL eligibility when family income exceeds maximum limit", () => {
    const student: EvaluationStudentProfile = {
      fullName: "Kavya Reddy",
      gender: "FEMALE",
      category: "GENERAL",
      state: "Andhra Pradesh",
      district: "Vijayawada",
      scoreObtained: 90.0,
      courseName: "B.Tech",
      annualFamilyIncome: 950000.0, // Exceeds 8 Lakhs
    };

    const result = EligibilityEngine.evaluate(student, sampleScholarship);

    expect(result.isEligible).toBe(false);
    expect(result.failedRules.some((r) => r.includes("exceeds maximum limit"))).toBe(true);
  });

  it("Should FAIL eligibility when course is not in allowed courses list", () => {
    const student: EvaluationStudentProfile = {
      fullName: "Divya Singh",
      gender: "FEMALE",
      category: "GENERAL",
      state: "Delhi",
      district: "New Delhi",
      scoreObtained: 80.0,
      courseName: "B.Com Commerce", // Not B.Tech or Engineering
      annualFamilyIncome: 400000.0,
    };

    const result = EligibilityEngine.evaluate(student, sampleScholarship);

    expect(result.isEligible).toBe(false);
    expect(result.failedRules.some((r) => r.includes("Course (B.Com Commerce) is not in eligible courses"))).toBe(true);
  });

  it("Should FAIL eligibility when male student applies for female-only scholarship", () => {
    const student: EvaluationStudentProfile = {
      fullName: "Rahul Verma",
      gender: "MALE", // Male applicant
      category: "GENERAL",
      state: "Tamil Nadu",
      district: "Coimbatore",
      scoreObtained: 95.0,
      courseName: "B.Tech",
      annualFamilyIncome: 200000.0,
    };

    const result = EligibilityEngine.evaluate(student, sampleScholarship);

    expect(result.isEligible).toBe(false);
    expect(result.failedRules.some((r) => r.includes("reserved for FEMALE_ONLY"))).toBe(true);
  });
});
