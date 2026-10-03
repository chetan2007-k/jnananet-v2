import { describe, it, expect } from "vitest";
import { S3Service } from "../services/s3Service";

describe("S3 Direct Storage Service Unit Test Suite", () => {
  it("Should PASS file validation for 2MB PDF document", () => {
    expect(() => S3Service.validateFile("application/pdf", 2 * 1024 * 1024)).not.toThrow();
  });

  it("Should PASS file validation for JPEG and PNG images", () => {
    expect(() => S3Service.validateFile("image/jpeg", 1 * 1024 * 1024)).not.toThrow();
    expect(() => S3Service.validateFile("image/png", 3 * 1024 * 1024)).not.toThrow();
  });

  it("Should REJECT unapproved file types (e.g. executable .exe or .zip)", () => {
    expect(() => S3Service.validateFile("application/zip", 1000)).toThrow("Invalid file format");
    expect(() => S3Service.validateFile("application/x-msdownload", 1000)).toThrow("Invalid file format");
  });

  it("Should REJECT files exceeding maximum 5MB size limit", () => {
    expect(() => S3Service.validateFile("application/pdf", 6 * 1024 * 1024)).toThrow("exceeds maximum 5 MB limit");
  });

  it("Should generate presigned upload URL structure", async () => {
    const result = await S3Service.generatePresignedUploadUrl({
      studentProfileId: "student-123",
      documentType: "INCOME_CERT",
      fileName: "income_cert_2026.pdf",
      mimeType: "application/pdf",
      fileSize: 1024 * 1024,
    });

    expect(result.uploadUrl).toBeDefined();
    expect(result.s3Key).toContain("documents/student-123/");
    expect(result.expiresInSeconds).toBe(900);
  });
});
