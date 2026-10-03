export interface User {
  id: string;
  email: string;
  role: "STUDENT" | "ADMIN" | "REVIEWER";
  fullName?: string;
}

export interface StudentProfile {
  id: string;
  fullName: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  category: "GENERAL" | "OBC" | "SC" | "ST" | "EWS";
  state: string;
  district: string;
  pincode?: string;
  isDifferentlyAbled?: boolean;
  academicRecord?: {
    currentLevel: string;
    courseName: string;
    institutionName: string;
    boardOrUniversity: string;
    yearOfStudy: number;
    scoreObtained: number;
    maxScore: number;
  };
  financialProfile?: {
    annualFamilyIncome: number;
    fatherOccupation?: string;
    motherOccupation?: string;
    hasIncomeCertificate?: boolean;
  };
}

export interface ScholarshipCriteria {
  minAcademicScore: number;
  maxFamilyIncome: number;
  allowedCourses: string[];
  allowedStates: string[];
  allowedCategories: string[];
  genderRestriction: "ALL" | "FEMALE_ONLY" | "MALE_ONLY";
}

export interface Scholarship {
  id: string;
  title: string;
  slug: string;
  provider: string;
  category: string;
  description: string;
  awardAmount: number;
  awardDetails?: string;
  officialUrl: string;
  minMarks: number;
  maxIncome: number;
  allowedCourses: string[];
  allowedStates: string[];
  allowedCategories: string[];
  deadlineDate?: string;
  isEligible?: boolean;
  matchScore?: number;
  recommendationTag?: "HIGH_PROBABILITY" | "STRONG_MATCH" | "MODERATE_MATCH" | "STRETCH" | "INELIGIBLE";
}

export interface RuleResult {
  ruleName: string;
  passed: boolean;
  message: string;
  required: string | number;
  actual: string | number;
}

export interface EvaluationResult {
  scholarshipId: string;
  scholarshipTitle: string;
  isEligible: boolean;
  matchScore: number;
  passedRules: string[];
  failedRules: string[];
  detailedRules: RuleResult[];
  recommendationTag: "HIGH_PROBABILITY" | "STRONG_MATCH" | "MODERATE_MATCH" | "STRETCH" | "INELIGIBLE";
}

export interface StudentDocument {
  id: string;
  documentType: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  verificationStatus: "PENDING" | "VERIFIED" | "REJECTED";
  uploadedAt: string;
  previewUrl?: string;
  s3Key?: string;
}

export interface Application {
  id: string;
  scholarshipId: string;
  scholarshipTitle: string;
  provider: string;
  awardAmount: number;
  status: "DRAFT" | "SUBMITTED" | "UNDER_REVIEW" | "ACCEPTED" | "REJECTED";
  readinessScore: number;
  submittedAt?: string;
}
