import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "../config/env";
import { logger } from "../utils/logger";

export interface PresignedUploadRequest {
  studentProfileId: string;
  documentType: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
}

export class S3Service {
  private static client = new S3Client({
    region: env.AWS_REGION,
    credentials:
      env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY
        ? {
            accessKeyId: env.AWS_ACCESS_KEY_ID,
            secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
          }
        : undefined,
  });

  static validateFile(mimeType: string, fileSize: number) {
    const allowedMimeTypes = ["application/pdf", "image/jpeg", "image/png"];
    const maxSizeBytes = 5 * 1024 * 1024; // 5MB

    if (!allowedMimeTypes.includes(mimeType)) {
      throw new Error(`Invalid file format '${mimeType}'. Allowed formats: PDF, JPEG, PNG.`);
    }

    if (fileSize > maxSizeBytes) {
      throw new Error(`File size (${(fileSize / (1024 * 1024)).toFixed(2)} MB) exceeds maximum 5 MB limit.`);
    }
  }

  static async generatePresignedUploadUrl(request: PresignedUploadRequest) {
    this.validateFile(request.mimeType, request.fileSize);

    const safeFileName = request.fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
    const s3Key = `documents/${request.studentProfileId}/${Date.now()}_${safeFileName}`;
    const bucket = env.S3_BUCKET_NAME;

    // Fallback for dev/testing when AWS credentials aren't present
    if (!env.AWS_ACCESS_KEY_ID || env.NODE_ENV === "test") {
      logger.info("Using S3 Presigned URL Mock (Dev/Test Mode)");
      return {
        uploadUrl: `https://${bucket}.s3.${env.AWS_REGION}.amazonaws.com/${s3Key}?mock_presigned_upload=true`,
        s3Key,
        s3Bucket: bucket,
        expiresInSeconds: 900,
      };
    }

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: s3Key,
      ContentType: request.mimeType,
    });

    const uploadUrl = await getSignedUrl(this.client, command, { expiresIn: 900 });

    return {
      uploadUrl,
      s3Key,
      s3Bucket: bucket,
      expiresInSeconds: 900,
    };
  }

  static async generatePresignedDownloadUrl(s3Bucket: string, s3Key: string) {
    if (!env.AWS_ACCESS_KEY_ID || env.NODE_ENV === "test") {
      return `https://${s3Bucket}.s3.${env.AWS_REGION}.amazonaws.com/${s3Key}?mock_presigned_download=true`;
    }

    const command = new GetObjectCommand({
      Bucket: s3Bucket,
      Key: s3Key,
    });

    return await getSignedUrl(this.client, command, { expiresIn: 900 });
  }
}
