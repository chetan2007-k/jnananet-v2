export interface EvaluationStudentProfile {
  fullName: string;
  gender?: string;
  category: string;
  state: string;
  district: string;
  isDifferentlyAbled?: boolean;
  scoreObtained: number; // percentage or normalized score
  courseName: string;
  annualFamilyIncome: number;
}

export interface EvaluationScholarshipCriteria {
  minAcademicScore: number;
  maxFamilyIncome: number;
  allowedCourses: string[]; // e.g. ["B.Tech", "ALL"]
  allowedStates: string[]; // e.g. ["Tamil Nadu", "ALL"]
  allowedCategories: string[]; // e.g. ["SC", "ST", "ALL"]
  genderRestriction: "ALL" | "FEMALE_ONLY" | "MALE_ONLY";
  disabilityRequired?: boolean;
}

export interface EvaluationScholarship {
  id: string;
  title: string;
  provider: string;
  awardAmount: number;
  criteria: EvaluationScholarshipCriteria;
}

export interface RuleResult {
  ruleName: string;
  passed: boolean;
  message: string;
  required: string | number;
  actual: string | number;
}

export interface DeterministicEvaluationResult {
  scholarshipId: string;
  scholarshipTitle: string;
  isEligible: boolean;
  matchScore: number; // 0 to 100
  passedRules: string[];
  failedRules: string[];
  detailedRules: RuleResult[];
  recommendationTag: "HIGH_PROBABILITY" | "STRONG_MATCH" | "MODERATE_MATCH" | "STRETCH" | "INELIGIBLE";
}

export class EligibilityEngine {
  static evaluate(student: EvaluationStudentProfile, scholarship: EvaluationScholarship): DeterministicEvaluationResult {
    const criteria = scholarship.criteria;
    const rules: RuleResult[] = [];

    // 1. Academic Score Rule
    const marksPassed = student.scoreObtained >= criteria.minAcademicScore;
    rules.push({
      ruleName: "Academic Score Requirement",
      passed: marksPassed,
      message: marksPassed
        ? `Academic score (${student.scoreObtained}%) satisfies required minimum of ${criteria.minAcademicScore}%`
        : `Academic score (${student.scoreObtained}%) is below required minimum of ${criteria.minAcademicScore}%`,
      required: `${criteria.minAcademicScore}%`,
      actual: `${student.scoreObtained}%`,
    });

    // 2. Family Income Rule
    const incomePassed = student.annualFamilyIncome <= criteria.maxFamilyIncome;
    rules.push({
      ruleName: "Annual Family Income Limit",
      passed: incomePassed,
      message: incomePassed
        ? `Annual family income (₹${student.annualFamilyIncome.toLocaleString("en-IN")}) is within limit of ₹${criteria.maxFamilyIncome.toLocaleString("en-IN")}`
        : `Annual family income (₹${student.annualFamilyIncome.toLocaleString("en-IN")}) exceeds maximum limit of ₹${criteria.maxFamilyIncome.toLocaleString("en-IN")}`,
      required: `≤ ₹${criteria.maxFamilyIncome.toLocaleString("en-IN")}`,
      actual: `₹${student.annualFamilyIncome.toLocaleString("en-IN")}`,
    });

    // 3. Course Match Rule
    const normUserCourse = student.courseName.trim().toLowerCase();
    const coursePassed =
      criteria.allowedCourses.includes("ALL") ||
      criteria.allowedCourses.some((c) => {
        const norm = c.trim().toLowerCase();
        return norm === "all" || normUserCourse.includes(norm) || norm.includes(normUserCourse);
      });
    rules.push({
      ruleName: "Eligible Course Alignment",
      passed: coursePassed,
      message: coursePassed
        ? `Course (${student.courseName}) is eligible`
        : `Course (${student.courseName}) is not in eligible courses list [${criteria.allowedCourses.join(", ")}]`,
      required: criteria.allowedCourses.join(", "),
      actual: student.courseName,
    });

    // 4. Domicile / State Rule
    const normUserState = student.state.trim().toLowerCase();
    const statePassed =
      criteria.allowedStates.includes("ALL") ||
      criteria.allowedStates.some((s) => s.trim().toLowerCase() === normUserState);
    rules.push({
      ruleName: "Domicile State Eligibility",
      passed: statePassed,
      message: statePassed
        ? `State (${student.state}) is eligible`
        : `State (${student.state}) is not supported [${criteria.allowedStates.join(", ")}]`,
      required: criteria.allowedStates.join(", "),
      actual: student.state,
    });

    // 5. Category Rule
    const normUserCat = student.category.trim().toUpperCase();
    const categoryPassed =
      criteria.allowedCategories.includes("ALL") ||
      criteria.allowedCategories.some((cat) => cat.trim().toUpperCase() === normUserCat);
    rules.push({
      ruleName: "Social Category Eligibility",
      passed: categoryPassed,
      message: categoryPassed
        ? `Category (${student.category}) is eligible`
        : `Category (${student.category}) is not eligible [${criteria.allowedCategories.join(", ")}]`,
      required: criteria.allowedCategories.join(", "),
      actual: student.category,
    });

    // 6. Gender Rule
    let genderPassed = true;
    if (criteria.genderRestriction === "FEMALE_ONLY") {
      genderPassed = String(student.gender || "").toUpperCase() === "FEMALE";
    } else if (criteria.genderRestriction === "MALE_ONLY") {
      genderPassed = String(student.gender || "").toUpperCase() === "MALE";
    }
    rules.push({
      ruleName: "Gender Eligibility Criteria",
      passed: genderPassed,
      message: genderPassed
        ? "Gender requirement satisfied"
        : `Scholarship is reserved for ${criteria.genderRestriction}`,
      required: criteria.genderRestriction,
      actual: student.gender || "Not specified",
    });

    const isEligible = marksPassed && incomePassed && coursePassed && statePassed && categoryPassed && genderPassed;
    const passedRules = rules.filter((r) => r.passed).map((r) => r.message);
    const failedRules = rules.filter((r) => !r.passed).map((r) => r.message);

    // Compute deterministic match score (0 - 100)
    let score = 0;
    if (isEligible) {
      // Base score 60 for passing all hard criteria
      score = 60;
      // Up to 20 pts for exceeding academic score
      const marksExcess = Math.max(0, student.scoreObtained - criteria.minAcademicScore);
      score += Math.min(20, Math.round((marksExcess / 40) * 20));

      // Up to 20 pts for being significantly below max family income limit
      const incomeHeadroom = Math.max(0, criteria.maxFamilyIncome - student.annualFamilyIncome);
      score += Math.min(20, Math.round((incomeHeadroom / criteria.maxFamilyIncome) * 20));
    } else {
      // Partial score based on passed rules ratio
      const passedCount = rules.filter((r) => r.passed).length;
      score = Math.round((passedCount / rules.length) * 45);
    }

    const matchScore = Math.max(0, Math.min(100, score));

    let recommendationTag: DeterministicEvaluationResult["recommendationTag"] = "INELIGIBLE";
    if (isEligible) {
      if (matchScore >= 85) recommendationTag = "HIGH_PROBABILITY";
      else if (matchScore >= 70) recommendationTag = "STRONG_MATCH";
      else recommendationTag = "MODERATE_MATCH";
    } else if (passedRules.length >= 4) {
      recommendationTag = "STRETCH";
    }

    return {
      scholarshipId: scholarship.id,
      scholarshipTitle: scholarship.title,
      isEligible,
      matchScore,
      passedRules,
      failedRules,
      detailedRules: rules,
      recommendationTag,
    };
  }
}
