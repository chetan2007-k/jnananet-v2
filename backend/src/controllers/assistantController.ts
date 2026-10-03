import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth";
import { BedrockService } from "../services/bedrockService";
import { prisma } from "../config/prisma";
import { sendSuccess } from "../utils/apiResponse";

export class AssistantController {
  static async chat(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { question, language } = req.body;

      if (!question || !String(question).trim()) {
        throw new Error("Question is required");
      }

      const profile = await prisma.studentProfile.findUnique({
        where: { userId },
        include: { academicRecord: true, financialProfile: true },
      });

      const responseText = await BedrockService.generateGuidance({
        question,
        language: language || "English",
        studentContext: profile
          ? {
              fullName: profile.fullName,
              courseName: profile.academicRecord?.courseName,
              scoreObtained: profile.academicRecord?.scoreObtained,
              annualFamilyIncome: profile.financialProfile?.annualFamilyIncome,
              state: profile.state,
              category: profile.category,
            }
          : undefined,
      });

      // Save AI analysis log
      await prisma.aIAnalysis.create({
        data: {
          userId,
          analysisType: "CHAT_ASSISTANT",
          modelId: process.env.BEDROCK_MODEL_ID || "anthropic.claude-3-5-sonnet",
          promptSummary: question,
          rawResponse: { text: responseText },
        },
      });

      return sendSuccess(res, { answer: responseText });
    } catch (error) {
      next(error);
    }
  }
}
