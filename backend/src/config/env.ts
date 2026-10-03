import dotenv from "dotenv";
import path from "path";
import { z } from "zod";

dotenv.config({ path: path.join(__dirname, "../../.env") });

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.string().transform((val) => parseInt(val, 10)).default("5000"),
  API_PREFIX: z.string().default("/api/v2"),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
  DATABASE_URL: z.string().default("postgresql://postgres:postgres@localhost:5432/jnananet_v2?schema=public"),
  JWT_SECRET: z.string().min(16).default("super-secret-jwt-access-key-32-chars-min"),
  JWT_REFRESH_SECRET: z.string().min(16).default("super-secret-jwt-refresh-key-32-chars-min"),
  JWT_ACCESS_EXPIRATION: z.string().default("15m"),
  JWT_REFRESH_EXPIRATION: z.string().default("7d"),
  AWS_REGION: z.string().default("ap-south-1"),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  S3_BUCKET_NAME: z.string().default("jnananet-documents-dev"),
  BEDROCK_MODEL_ID: z.string().default("anthropic.claude-3-5-sonnet-20240620-v1:0"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("❌ Invalid Environment Configuration:", parsedEnv.error.format());
  throw new Error("Invalid Environment Variables");
}

export const env = parsedEnv.data;
