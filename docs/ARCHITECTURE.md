# JnanaNet V2 — Architecture Specification

## 1. System Architecture Overview

JnanaNet V2 is a modern, production-grade AI-Powered Scholarship Intelligence & Decision-Support Platform designed for Indian students. It replaces the prototype system with a decoupled, high-performance, deterministic-first architecture.

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                                 PRESENTATION LAYER                               │
│  React 18 + Vite + TypeScript + Tailwind CSS / Modern CSS Tokens + TanStack Query │
└────────────────────────────────────────┬─────────────────────────────────────────┘
                                         │ HTTPS / REST (JSON) + JWT
┌────────────────────────────────────────▼─────────────────────────────────────────┐
│                                   API GATEWAY                                    │
│       Node.js + Express + TypeScript (Helmet, CORS, Rate Limit, Zod Validator)    │
└──────────┬─────────────────────────────┬──────────────────────────┬──────────────┘
           │                             │                          │
┌──────────▼─────────────┐   ┌───────────▼────────────┐   ┌─────────▼──────────────┐
│ DETERMINISTIC ENGINE   │   │  AI INTELLIGENCE LAYER │   │   DOCUMENT & STORAGE   │
│  Rule-based filter for │   │ Amazon Bedrock (Claude │   │  AWS S3 Presigned URLs │
│  Income, Marks, Course,│   │ 3.5 / Titan) + Vision  │   │  Private Buckets & OCR │
│  State, and Demographics│   │  JSON Prompt Validation│   │  Validation Service    │
└──────────┬─────────────┘   └───────────┬────────────┘   └─────────┬──────────────┘
           │                             │                          │
┌──────────▼─────────────────────────────▼──────────────────────────▼──────────────┐
│                                 DATA PERSISTENCE                                 │
│          Managed PostgreSQL + Prisma ORM / Migrations + Redis Cache              │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Core Architectural Principles

1. **Deterministic Eligibility First, AI Second**:
   - Hard criteria (income thresholds, academic minimums, course eligibility, domicile, social category) are processed by a deterministic engine in SQL and TypeScript.
   - AI (Amazon Bedrock) is used for natural language explanation, missing requirement breakdown, strategy suggestions, document analysis, and conversational assistance.

2. **Decoupled & Service-Oriented Architecture**:
   - The Frontend (React/Vite) and Backend (Node/Express/TS) are completely separated.
   - Services within the backend are strictly modularized: Auth Service, Profile Service, Eligibility Engine, AI Engine, Document Service, Notification Service.

3. **Zero Secrets in Code & Secure Credential Boundary**:
   - All AWS keys, database credentials, JWT secrets, and API keys are stored in environment variables (`.env`).
   - S3 uploads use presigned PUT URLs so credentials never touch the client and binary streams bypass the application server.

4. **Normalized & Relational Data Management**:
   - Replaces in-memory JSON files with a production PostgreSQL database featuring foreign keys, cascading rules, database indexes, and transaction isolation.

5. **Type Safety Across Layers**:
   - Full TypeScript end-to-end on backend and frontend, sharing schema contracts via Zod.

---

## 3. Core V2 Modules & Architecture

### A. Authentication & User Management Module
- **Features**: Registration, Login, JWT issuing (Short-lived Access Token in-memory + HttpOnly Secure Refresh Token), Password Reset via signed tokens, Role-Based Access Control (Student, Admin, Reviewer).
- **Security**: Argon2 / Bcrypt password hashing, rate-limited auth endpoints.

### B. Student Profile & Eligibility Matrix Module
- **Sub-components**:
  - Personal Information (Name, DOB, Gender, Category, State, District).
  - Academic Profile (Current Course, Specialization, Institute, Board/University, CGPA/Percentage, Year of Study).
  - Financial Profile (Annual Family Income, Father/Mother Occupation, EWS Status, Income Certificate Ref).
  - Demographic & Special Eligibility (Single Girl Child, Disability status, Sports level, Religion, Domicile).

### C. Scholarship Database & Criteria Taxonomy
- Normalized catalog supporting complex criteria:
  - Numeric ranges (`min_marks`, `max_income`).
  - Categorical sets (`allowed_states`, `allowed_categories`, `allowed_courses`).
  - Deadlines, funding amounts, benefit breakdown, official portal URLs, and required document checklists.

### D. Deterministic Eligibility Rules Engine
- Evaluates candidate profiles against scholarship rules using set algebra:
  ```ts
  type EligibilityResult = {
    scholarshipId: string;
    isEligible: boolean;
    score: number; // 0 - 100 confidence score
    hardPassed: string[];
    hardFailed: string[];
    gapAnalysis: { field: string; required: any; actual: any }[];
  };
  ```

### E. AI Scholarship Matching & Recommendation Engine (Amazon Bedrock)
- Consumes deterministic outputs and runs structured prompts through Bedrock.
- Generates:
  - Personal recommendations ranked by strategic impact.
  - "Why you match" narratives in English and regional languages.
  - Actionable advice on how to improve eligibility (e.g. updating income certificates, mark improvement goals).

### F. Scholarship Comparison Engine
- Side-by-side comparison of shortlisted scholarships across 12 dimensions:
  - Total Financial Benefit, Renewal Conditions, Application Effort, Acceptance Rate Estimate, Required Documents, Deadline Urgency.

### G. Document Management & S3 Direct Storage Module
- Direct S3 uploads via presigned URLs.
- Document taxonomy: Aadhaar, Income Certificate, Marksheet, Bonafide, Caste Certificate, Bank Passbook, Disability Cert.
- Storage encryption at rest (SSE-S3 / SSE-KMS) and private access via presigned GET links expiring in 15 minutes.

### H. AI Document Intelligence Module
- Automated document analysis using Bedrock Multimodal / Textract:
  - OCR extraction of key fields (Name, Annual Income, Issue Date, Certificate No).
  - Cross-verification against student profile data to flag mismatches before submission.

### I. Application Readiness & Deadline Tracking Module
- Readiness Meter (0–100%) calculating profile completeness + verified documents + eligibility score.
- Automated deadline alert schedule (14 days, 7 days, 3 days, 1 day before closing).

### J. AI Scholarship Assistant (Chat Service)
- Stateful conversational service backed by Amazon Bedrock.
- Maintains user context (profile summary + current shortlisted scholarships).
- Validates LLM outputs to guarantee structured, accurate responses without hallucinations.

### K. Student Dashboard & Analytics
- Metrics overview: Total Matches, High Match Opportunities, Active Applications, Profile Completeness, Verified Documents, Upcoming Deadlines.

---

## 4. Technology Stack Summary

| Layer | Technology Selected | Rationale |
|---|---|---|
| **Frontend** | React 18, Vite, TypeScript | Fast HMR, strong typing, optimal bundle size |
| **UI Framework** | Tailwind CSS / Vanilla CSS Variables | SaaS-grade design tokens, modern aesthetic |
| **State & Cache** | TanStack Query v5 + Zustand | Client UI state separated from server caching |
| **Backend** | Node.js, Express, TypeScript | High concurrency, asynchronous I/O, rapid dev |
| **Database** | PostgreSQL 16 + Prisma ORM | Relational integrity, migrations, type-safe queries |
| **AI Cloud** | Amazon Bedrock (Claude / Titan) | Enterprise SLA, regional compliance, zero data leaks |
| **Object Storage** | Amazon S3 | Scalable, secure storage with presigned URLs |
| **Validation** | Zod | Single source of truth for schema validation |
| **Testing** | Vitest, Supertest, Playwright | Unit, integration, and E2E coverage |
