import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth";
import { prisma } from "../config/prisma";
import { S3Service } from "../services/s3Service";
import { DocumentIntelligenceService } from "../services/documentIntelligenceService";
import { sendSuccess } from "../utils/apiResponse";

export class DocumentController {
  static async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const profile = await prisma.studentProfile.findUnique({ where: { userId } });
      if (!profile) throw new Error("Student profile not found");

      const documents = await prisma.studentDocument.findMany({
        where: { studentProfileId: profile.id },
        orderBy: { uploadedAt: "desc" },
      });

      return sendSuccess(res, documents);
    } catch (error) {
      next(error);
    }
  }

  static async getPresignedUploadUrl(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { documentType, fileName, mimeType, fileSize } = req.body;

      const profile = await prisma.studentProfile.findUnique({ where: { userId } });
      if (!profile) throw new Error("Student profile not found");

      const presigned = await S3Service.generatePresignedUploadUrl({
        studentProfileId: profile.id,
        documentType,
        fileName,
        mimeType,
        fileSize,
      });

      // Register draft document record
      const doc = await prisma.studentDocument.create({
        data: {
          studentProfileId: profile.id,
          documentType: documentType as any,
          fileName,
          fileSize,
          mimeType,
          s3Key: presigned.s3Key,
          s3Bucket: presigned.s3Bucket,
          verificationStatus: "PENDING",
        },
      });

      return sendSuccess(res, {
        documentId: doc.id,
        uploadUrl: presigned.uploadUrl,
        expiresInSeconds: presigned.expiresInSeconds,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getDownloadUrl(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const documentId = String(req.params.id);

      const profile = await prisma.studentProfile.findUnique({ where: { userId } });
      if (!profile) throw new Error("Student profile not found");

      const document = await prisma.studentDocument.findFirst({
        where: { id: documentId, studentProfileId: profile.id },
      });

      if (!document) {
        throw new Error("Document not found");
      }

      const downloadUrl = await S3Service.generatePresignedDownloadUrl(document.s3Bucket, document.s3Key);

      return sendSuccess(res, { downloadUrl });
    } catch (error) {
      next(error);
    }
  }

  static async analyze(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const documentId = String(req.params.id);

      const profile = await prisma.studentProfile.findUnique({ where: { userId } });
      if (!profile) throw new Error("Student profile not found");

      const result = await DocumentIntelligenceService.analyzeDocument(documentId, profile.id);

      return sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }
}
