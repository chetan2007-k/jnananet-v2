import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { env } from "../config/env";
import { prisma } from "../config/prisma";
import { AuthenticatedUser } from "../middleware/auth";

export const registerSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  fullName: z.string().min(2, "Full name is required"),
  state: z.string().min(2, "State is required"),
  district: z.string().min(2, "District is required"),
  category: z.enum(["GENERAL", "OBC", "SC", "ST", "EWS"]).default("GENERAL"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export class AuthService {
  static generateTokens(payload: AuthenticatedUser) {
    const accessToken = jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_ACCESS_EXPIRATION as any,
    });

    const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRATION as any,
    });

    return { accessToken, refreshToken };
  }

  static async register(input: RegisterInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
    });

    if (existingUser) {
      throw new Error("An account with this email already exists");
    }

    const passwordHash = await bcrypt.hash(input.password, 12);

    const user = await prisma.user.create({
      data: {
        email: input.email.toLowerCase(),
        passwordHash,
        role: "STUDENT",
        isVerified: true,
        profile: {
          create: {
            fullName: input.fullName,
            state: input.state,
            district: input.district,
            category: input.category as any,
            academicRecord: {
              create: {
                currentLevel: "Undergraduate",
                courseName: "B.Tech",
                institutionName: "Unspecified Institute",
                boardOrUniversity: "State University",
                yearOfStudy: 1,
                gradeType: "PERCENTAGE",
                scoreObtained: 75.0,
              },
            },
            financialProfile: {
              create: {
                annualFamilyIncome: 300000.0,
              },
            },
          },
        },
      },
      include: {
        profile: true,
      },
    });

    const tokens = this.generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role as any,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
      tokens,
    };
  }

  static async login(input: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
      include: { profile: true },
    });

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(input.password, user.passwordHash);
    if (!isMatch) {
      throw new Error("Invalid email or password");
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const tokens = this.generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role as any,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
      tokens,
    };
  }

  static async verifyRefreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as AuthenticatedUser;
      const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

      if (!user) {
        throw new Error("User no longer exists");
      }

      const accessToken = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        env.JWT_SECRET,
        { expiresIn: env.JWT_ACCESS_EXPIRATION as any }
      );

      return { accessToken };
    } catch {
      throw new Error("Invalid or expired refresh token");
    }
  }
}
