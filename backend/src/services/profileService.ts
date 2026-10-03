import { z } from "zod";
import { prisma } from "../config/prisma";

export const updatePersonalSchema = z.object({
  fullName: z.string().min(2).optional(),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"]).optional(),
  category: z.enum(["GENERAL", "OBC", "SC", "ST", "EWS"]).optional(),
  state: z.string().min(2).optional(),
  district: z.string().min(2).optional(),
  pincode: z.string().optional(),
  isDifferentlyAbled: z.boolean().optional(),
  disabilityPercentage: z.number().min(0).max(100).optional(),
  singleGirlChild: z.boolean().optional(),
});

export const updateAcademicSchema = z.object({
  currentLevel: z.string().min(2),
  courseName: z.string().min(2),
  specialization: z.string().optional(),
  institutionName: z.string().min(2),
  boardOrUniversity: z.string().min(2),
  yearOfStudy: z.number().int().min(1).max(6),
  gradeType: z.enum(["PERCENTAGE", "CGPA"]).default("PERCENTAGE"),
  scoreObtained: z.number().min(0).max(100),
  maxScore: z.number().min(1).default(100),
  tenthPercentage: z.number().min(0).max(100).optional(),
  twelfthPercentage: z.number().min(0).max(100).optional(),
});

export const updateFinancialSchema = z.object({
  annualFamilyIncome: z.number().min(0),
  fatherOccupation: z.string().optional(),
  motherOccupation: z.string().optional(),
  hasIncomeCertificate: z.boolean().optional(),
  incomeCertificateNumber: z.string().optional(),
  incomeCertificateIssuer: z.string().optional(),
});

export class ProfileService {
  static async getProfileByUserId(userId: string) {
    const profile = await prisma.studentProfile.findUnique({
      where: { userId },
      include: {
        academicRecord: true,
        financialProfile: true,
        documents: true,
      },
    });

    if (!profile) {
      throw new Error("Student profile not found");
    }

    return profile;
  }

  static async updatePersonal(userId: string, data: z.infer<typeof updatePersonalSchema>) {
    const profile = await prisma.studentProfile.update({
      where: { userId },
      data: {
        ...data,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
      },
      include: {
        academicRecord: true,
        financialProfile: true,
      },
    });

    return profile;
  }

  static async updateAcademic(userId: string, data: z.infer<typeof updateAcademicSchema>) {
    const profile = await prisma.studentProfile.findUnique({ where: { userId } });
    if (!profile) throw new Error("Student profile not found");

    const academicRecord = await prisma.academicRecord.upsert({
      where: { studentProfileId: profile.id },
      create: {
        studentProfileId: profile.id,
        ...data,
      },
      update: {
        ...data,
      },
    });

    return academicRecord;
  }

  static async updateFinancial(userId: string, data: z.infer<typeof updateFinancialSchema>) {
    const profile = await prisma.studentProfile.findUnique({ where: { userId } });
    if (!profile) throw new Error("Student profile not found");

    const financialProfile = await prisma.financialProfile.upsert({
      where: { studentProfileId: profile.id },
      create: {
        studentProfileId: profile.id,
        ...data,
      },
      update: {
        ...data,
      },
    });

    return financialProfile;
  }

  static async calculateProfileStrength(userId: string) {
    const profile = await prisma.studentProfile.findUnique({
      where: { userId },
      include: {
        academicRecord: true,
        financialProfile: true,
        documents: true,
      },
    });

    if (!profile) return { score: 0, items: [] };

    let totalPoints = 0;
    const maxPoints = 100;
    const checklist: Array<{ item: string; completed: boolean; points: number }> = [];

    // Personal details (25 pts)
    const hasPersonal = Boolean(profile.fullName && profile.state && profile.district && profile.phone);
    checklist.push({ item: "Personal & Location Details", completed: hasPersonal, points: 25 });
    if (hasPersonal) totalPoints += 25;

    // Academic Details (25 pts)
    const hasAcademic = Boolean(profile.academicRecord && profile.academicRecord.scoreObtained > 0);
    checklist.push({ item: "Academic Marks & Institution", completed: hasAcademic, points: 25 });
    if (hasAcademic) totalPoints += 25;

    // Financial Details (25 pts)
    const hasFinancial = Boolean(profile.financialProfile && profile.financialProfile.annualFamilyIncome > 0);
    checklist.push({ item: "Annual Family Income Record", completed: hasFinancial, points: 25 });
    if (hasFinancial) totalPoints += 25;

    // Uploaded Documents (25 pts)
    const hasDocs = profile.documents.length > 0;
    checklist.push({ item: "Uploaded Verification Documents", completed: hasDocs, points: 25 });
    if (hasDocs) totalPoints += 25;

    return {
      score: Math.min(maxPoints, totalPoints),
      checklist,
    };
  }
}
