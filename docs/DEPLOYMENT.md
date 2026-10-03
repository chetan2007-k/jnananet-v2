# JnanaNet V2 — Deployment & Infrastructure Architecture

## 1. Cloud Architecture Overview

JnanaNet V2 is deployed using a decoupled, production-grade cloud topology:

```
                  [ USER / BROWSER ]
                          │
         ┌────────────────┴────────────────┐
         │                                 │
         ▼                                 ▼
┌──────────────────┐             ┌──────────────────┐
│ FRONTEND HOSTING │             │ CUSTOM DOMAIN    │
│ Vercel Edge /    │             │ Cloudflare DNS / │
│ AWS CloudFront   │             │ SSL / WAF        │
└────────┬─────────┘             └────────┬─────────┘
         │                                │
         └────────────────┬───────────────┘
                          │ HTTPS / REST (JSON)
                          ▼
             ┌─────────────────────────┐
             │ APPLICATION LOAD BALANCER│
             └────────────┬────────────┘
                          │
                          ▼
             ┌─────────────────────────┐
             │ BACKEND HOSTING         │
             │ AWS App Runner / ECS    │
             │ Docker Containerized    │
             └────────────┬────────────┘
                          │
      ┌───────────────────┼───────────────────┐
      │                   │                   │
      ▼                   ▼                   ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│  DATABASE    │   │ OBJECT STORE │   │ AI INFERENCE │
│ AWS RDS      │   │ AWS S3       │   │ AWS Bedrock  │
│ PostgreSQL   │   │ Private      │   │ (ap-south-1) │
└──────────────┘   └──────────────┘   └──────────────┘
```

---

## 2. Infrastructure Setup & Specifications

### 2.1. Frontend Deployment (Vercel / CloudFront)
- **Source**: `frontend/`
- **Build Command**: `npm run build` (Vite output: `dist/`)
- **Environment Variables**:
  - `VITE_API_BASE_URL`: Base URL of the deployed Express backend (`https://api.jnananet.in/api/v2`).
- **CDN Features**: Global edge caching, HTTP/2 & HTTP/3 support, automatic HTTPS certificates.

### 2.2. Backend Deployment (AWS App Runner / ECS Fargate)
- **Source**: `backend/`
- **Runtime**: Node.js 20 LTS / Docker Container (Alpine-based Node image).
- **Process Manager**: Container entrypoint running compiled TypeScript (`dist/server.js`).
- **Health Checks**: Endpoint `GET /api/v2/health` monitored every 30 seconds.
- **Environment Configuration**: AWS Secrets Manager / App Runner environment variables.

### 2.3. Database (AWS RDS PostgreSQL)
- **Engine**: PostgreSQL 16.x.
- **Instance Class**: `db.t4g.micro` (Dev/Staging) -> `db.m6g.large` (Multi-AZ Production).
- **Storage**: gp3 SSD with auto-scaling storage.
- **Backups**: Daily automated snapshots with 7-day retention.
- **ORM Migrations**: Executed in CI/CD pipeline step via `npx prisma migrate deploy`.

### 2.4. Object Storage (Amazon S3)
- **Bucket Name**: `jnananet-documents-prod`
- **Access Configuration**: Block all public access enabled. Access restricted strictly via IAM roles and presigned URLs.
- **CORS Configuration**:
  ```json
  [
    {
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["GET", "PUT", "HEAD"],
      "AllowedOrigins": ["https://app.jnananet.in", "http://localhost:5173"],
      "ExposeHeaders": ["ETag"],
      "MaxAgeSeconds": 3000
    }
  ]
  ```

### 2.5. AI Foundation Models (Amazon Bedrock)
- **Region**: `ap-south-1` (Mumbai) / `us-east-1` (N. Virginia).
- **Models Used**:
  - Anthropic Claude 3.5 Sonnet (`anthropic.claude-3-5-sonnet-20240620-v1:0`) — Deep reasoning, gap analysis, complex query resolution.
  - Anthropic Claude 3 Haiku (`anthropic.claude-3-haiku-20240307-v1:0`) — High-speed conversational AI chat.
  - Amazon Titan Text Express (`amazon.titan-text-express-v1`) — Lightweight summarization fallback.
- **IAM Policy**: Least-privilege IAM policy allowing `bedrock:InvokeModel` only.

---

## 3. Environment Variables Strategy

### `.env.example` Schema:
```env
# Application Setup
NODE_ENV=production
PORT=5000
API_PREFIX=/api/v2
CORS_ORIGINS=https://app.jnananet.in

# Database
DATABASE_URL=postgresql://jnananet_user:SecurePassword123@jnananet-db.cx91234.ap-south-1.rds.amazonaws.com:5432/jnananet_v2?schema=public

# Security & Secrets
JWT_SECRET=super-secret-jwt-access-key-32-chars-min
JWT_REFRESH_SECRET=super-secret-jwt-refresh-key-32-chars-min
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# AWS Configuration
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXXXXXXXX
AWS_SECRET_ACCESS_KEY=XXXXXXXXXXXXXXXX────────────────
S3_BUCKET_NAME=jnananet-documents-prod
BEDROCK_MODEL_ID=anthropic.claude-3-5-sonnet-20240620-v1:0

# Email SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=jnananet.team@gmail.com
SMTP_PASS=xxxx-xxxx-xxxx-xxxx
```

---

## 4. CI/CD Deployment Pipeline (GitHub Actions)

```mermaid
graph TD
    A[Push to main] --> B[Lint & Typecheck]
    B --> C[Run Vitest & Supertest]
    C --> D[Build Docker Container]
    D --> E[Run Database Migrations]
    E --> F[Deploy Backend to App Runner / ECS]
    F --> G[Deploy Frontend to Vercel / S3]
    G --> H[Run E2E Smoke Tests]
```
