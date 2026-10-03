# JnanaNet V2 — Development Roadmap & Implementation Plan

## 1. Phased Development Roadmap

The development of JnanaNet V2 is structured into 6 sequential, testable phases. Each phase concludes with explicit automated testing, linting, and architecture verification.

```
┌──────────────────────────────────────────────────────────────────────────┐
│ PHASE 1: Architecture, Audit & Documentation (CURRENT DELIVERABLE)       │
│ - Audit old codebase, create ARCHITECTURE.md, DATABASE.md, API.md, etc. │
└────────────────────────────────────┬─────────────────────────────────────┘
                                     │
┌────────────────────────────────────▼─────────────────────────────────────┐
│ PHASE 2: Core Foundation & Database                                      │
│ - Setup Express + TypeScript backend, Prisma ORM, PostgreSQL schema       │
│ - Implement Auth (JWT, Argon2), User Profile CRUD, Zod Validation         │
└────────────────────────────────────┬─────────────────────────────────────┘
                                     │
┌────────────────────────────────────▼─────────────────────────────────────┐
│ PHASE 3: Deterministic Eligibility Engine & Scholarship Catalog          │
│ - Seed scholarship database with criteria rules                          │
│ - Build TypeScript deterministic engine (set math filtering & gap rules) │
│ - Unit tests for 100% eligibility coverage                               │
└────────────────────────────────────┬─────────────────────────────────────┘
                                     │
┌────────────────────────────────────▼─────────────────────────────────────┐
│ PHASE 4: Amazon Bedrock AI Integration & Document Management             │
│ - Integrate Bedrock runtime SDK (Claude 3.5 Sonnet / Haiku)              │
│ - Build AI explanation layer, JSON validation & Chat assistant           │
│ - Implement S3 direct uploads (Presigned URLs) & AI Document OCR         │
└────────────────────────────────────┬─────────────────────────────────────┘
                                     │
┌────────────────────────────────────▼─────────────────────────────────────┐
│ PHASE 5: SaaS Student Dashboard & Frontend UI                            │
│ - Build React + Vite + TypeScript frontend with Tailwind CSS / Design system│
│ - Build Dashboard, Scholarship Matcher, Comparison Tool, Application Tracker│
│ - Integrate TanStack Query & state management                             │
└────────────────────────────────────┬─────────────────────────────────────┘
                                     │
┌────────────────────────────────────▼─────────────────────────────────────┐
│ PHASE 6: E2E Integration, Security Hardening & Deployment               │
│ - OWASP security audit, rate limiting, S3 CORS, CORS whitelist            │
│ - Cypress / Playwright E2E tests                                         │
│ - Deploy Frontend to Vercel and Backend to AWS App Runner / ECS          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Phase-by-Phase Milestone Breakdown

| Phase | Duration Est. | Core Deliverables | Verification Strategy |
|---|---|---|---|
| **Phase 1** | Done | System Audit, Architecture Docs, Database Schema, API Spec, Roadmap | Manual User Approval |
| **Phase 2** | Week 1 | Backend setup, DB Migrations, Prisma Client, JWT Auth, Profile CRUD | Vitest unit tests, Supertest endpoint tests |
| **Phase 3** | Week 2 | Scholarship Catalog DB, Deterministic Rules Engine, Gap Analysis | Vitest engine test matrix (20+ test cases) |
| **Phase 4** | Week 3 | Bedrock Service layer, AI structured prompts, S3 Presigned URLs, OCR | Mock AWS SDK tests, Bedrock JSON output schema tests |
| **Phase 5** | Week 4 | React SPA, SaaS Design Tokens, Dashboard, Matcher, AI Chat UI | Component tests, visual verification |
| **Phase 6** | Week 5 | Full stack wiring, Security Headers, Rate Limiting, Deployment | E2E integration test suite, Production Health Check |
