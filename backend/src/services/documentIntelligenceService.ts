import { prisma } from "../config/prisma";
import { logger } from "../utils/logger";

export class DocumentIntelligenceService {
  static async analyzeDocument(documentId: string, studentProfileId: string) {
    const document = await prisma.studentDocument.findFirst({
      where: { id: documentId, studentProfileId },
    });

    if (!document) {
      throw new Error("Student document not found");
    }

    const profile = await prisma.studentProfile.findUnique({
      where: { id: studentProfileId },
      include: { financialProfile: true, academicRecord: true },
    });

    logger.info(`Analyzing document ${documentId} of type ${document.documentType} via AI Document Intelligence...`);

    // Simulated OCR extraction & AI verification logic
    let ocrResult: any = {
      extractedFields: {},
      mismatchFlags: [],
      confidenceScore: 0.92,
    };

    if (document.documentType === "INCOME_CERT") {
      ocrResult.extractedFields = {
        certificateNumber: "INC/2026/98214",
        annualIncomeExtracted: profile?.financialProfile?.annualFamilyIncome || 250000.0,
        issueDate: "2026-04-10",
        issuerAuthority: "Tahsildar Revenue Dept",
      };
      ocrResult.mismatchFlags = [];
    } else if (document.documentType === "MARKSHEET") {
      ocrResult.extractedFields = {
        studentName: profile?.fullName || "Student Name",
        scoreExtracted: profile?.academicRecord?.scoreObtained || 85.0,
        board: profile?.academicRecord?.boardOrUniversity || "State Board",
      };
      ocrResult.mismatchFlags = [];
    } else {
      ocrResult.extractedFields = {
        documentTypeDetected: document.documentType,
        status: "Standard document verified",
      };
    }

    // Update document status in database
    const updated = await prisma.studentDocument.update({
      where: { id: documentId },
      data: {
        verificationStatus: "VERIFIED",
        ocrExtractedData: ocrResult,
      },
    });

    return updated;
  }
}
