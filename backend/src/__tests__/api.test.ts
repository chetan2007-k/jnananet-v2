import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import bcrypt from "bcryptjs";
import { createApp } from "../app";

const TEST_PASSWORD_HASH = bcrypt.hashSync("Password123", 10);

// Mock Prisma client for unit testing without live PostgreSQL database dependency
vi.mock("../config/prisma", () => {
  const mockUser = {
    id: "test-user-uuid-1234",
    email: "test.student@jnananet.in",
    passwordHash: bcrypt.hashSync("Password123", 10),
    role: "STUDENT",
    isVerified: true,
    status: "ACTIVE",
    profile: {
      id: "test-profile-uuid-5678",
      userId: "test-user-uuid-1234",
      fullName: "Test Student",
      state: "Tamil Nadu",
      district: "Chennai",
      category: "GENERAL",
      academicRecord: {
        id: "academic-id-1",
        scoreObtained: 85.5,
        courseName: "B.Tech",
      },
      financialProfile: {
        id: "financial-id-1",
        annualFamilyIncome: 250000.0,
      },
      documents: [],
    },
  };

  return {
    prisma: {
      user: {
        findUnique: vi.fn().mockImplementation(({ where }) => {
          if (where.email === "test.student@jnananet.in" || where.id === "test-user-uuid-1234") {
            return Promise.resolve({
              ...mockUser,
              passwordHash: TEST_PASSWORD_HASH,
            });
          }
          return Promise.resolve(null);
        }),
        create: vi.fn().mockResolvedValue({
          ...mockUser,
          email: "new.student@jnananet.in",
        }),
        update: vi.fn().mockResolvedValue(mockUser),
      },
      studentProfile: {
        findUnique: vi.fn().mockResolvedValue(mockUser.profile),
        update: vi.fn().mockResolvedValue({
          ...mockUser.profile,
          phone: "9876543210",
        }),
      },
      academicRecord: {
        upsert: vi.fn().mockResolvedValue(mockUser.profile.academicRecord),
      },
      financialProfile: {
        upsert: vi.fn().mockResolvedValue(mockUser.profile.financialProfile),
      },
    },
  };
});

describe("JnanaNet V2 Core API & Auth Test Suite", () => {
  const app = createApp();
  let authToken = "";

  it("GET /api/v2/health - Should return healthy status payload", async () => {
    const res = await request(app).get("/api/v2/health");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe("HEALTHY");
    expect(res.body.data.version).toBe("v2.0.0");
  });

  it("POST /api/v2/auth/register - Should register a new student", async () => {
    const res = await request(app).post("/api/v2/auth/register").send({
      email: "new.student@jnananet.in",
      password: "Password123",
      fullName: "New Student",
      state: "Tamil Nadu",
      district: "Coimbatore",
      category: "GENERAL",
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
  });

  it("POST /api/v2/auth/register - Should reject invalid email format", async () => {
    const res = await request(app).post("/api/v2/auth/register").send({
      email: "invalid-email",
      password: "short",
      fullName: "",
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("POST /api/v2/auth/login - Should authenticate registered student and issue JWT", async () => {
    const res = await request(app).post("/api/v2/auth/login").send({
      email: "test.student@jnananet.in",
      password: "Password123",
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
    authToken = res.body.data.accessToken;
  });

  it("GET /api/v2/profile - Should reject request without authorization header", async () => {
    const res = await request(app).get("/api/v2/profile");
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("GET /api/v2/profile - Should fetch student profile with valid JWT Bearer token", async () => {
    const res = await request(app)
      .get("/api/v2/profile")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.fullName).toBe("Test Student");
  });

  it("PUT /api/v2/profile/personal - Should update personal details", async () => {
    const res = await request(app)
      .put("/api/v2/profile/personal")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        phone: "9876543210",
        pincode: "600001",
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("GET /api/v2/profile/strength - Should calculate student profile strength score", async () => {
    const res = await request(app)
      .get("/api/v2/profile/strength")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.score).toBeGreaterThan(0);
    expect(res.body.data.checklist).toBeInstanceOf(Array);
  });
});
