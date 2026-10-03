# JnanaNet V2 — AI-Powered Scholarship Intelligence Platform

![JnanaNet V2 Architecture](https://img.shields.io/badge/Architecture-Decoupled_SaaS-blue)
![React](https://img.shields.io/badge/Frontend-React_18_%2B_Vite_%2B_TS-61DAFB)
![Node](https://img.shields.io/badge/Backend-Node.js_%2B_Express_%2B_TS-339933)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL_16_%2B_Prisma-4169E1)
![AWS Bedrock](https://img.shields.io/badge/AI-Amazon_Bedrock-FF9900)
![AWS S3](https://img.shields.io/badge/Storage-AWS_S3_Presigned-569A31)

## 📌 Project Overview
JnanaNet V2 is an enterprise-grade AI-powered scholarship discovery, eligibility calculation, document intelligence, and decision-support platform designed for Indian students.

Unlike traditional scholarship portals, JnanaNet V2 pairs a **deterministic eligibility engine** (for hard math/categorical constraints) with **Amazon Bedrock generative AI** (for personalized narratives, gap analysis, document understanding, and natural-language assistance).

---

## 📁 Repository Structure
```
jnananet-v2/
├── docs/                     # System architecture & technical specs
│   ├── ARCHITECTURE.md       # High-level architecture & system design
│   ├── DATABASE.md           # PostgreSQL schema, ERD & table specs
│   ├── API.md                # REST API specification & payloads
│   ├── DEPLOYMENT.md         # AWS + Vercel deployment pipeline
│   ├── SECURITY.md           # Security model, threat analysis & OWASP
│   └── ROADMAP.md            # Phased implementation roadmap
├── frontend/                 # React + Vite + TypeScript web application (Phase 5)
├── backend/                  # Node.js + Express + TypeScript REST API (Phases 2-4)
├── database/                 # Prisma ORM schema & database migrations
├── .env.example              # Environment configuration template
└── README.md                 # Project root documentation
```

---

## 🛠 Tech Stack Overview
- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS / Modern CSS Variables, TanStack Query v5, Zustand, Lucide Icons.
- **Backend**: Node.js 20 LTS, Express.js, TypeScript, Zod Schema Validation, Winston Logging.
- **Database**: PostgreSQL 16 + Prisma ORM.
- **AI Service**: Amazon Bedrock (Claude 3.5 Sonnet / Haiku, Titan Text) via AWS SDK v3.
- **Storage**: AWS S3 Private Buckets with Presigned Upload/Download URLs.
- **Security**: JWT Auth (HttpOnly Refresh Cookies), Argon2 Password Hashing, Helmet.js, Rate-Limiting.

---

## 📚 Technical Documentation
Detailed engineering design documents are located in the `docs/` folder:
- 🏗 [Architecture Specification](docs/ARCHITECTURE.md)
- 🗄 [Database Schema Definition](docs/DATABASE.md)
- 🔌 [REST API Documentation](docs/API.md)
- 🚀 [Deployment Architecture](docs/DEPLOYMENT.md)
- 🛡 [Security Model & Threat Defense](docs/SECURITY.md)
- 🗺 [Development Roadmap](docs/ROADMAP.md)

---

## ⚖️ License & Confidentiality
JnanaNet V2 © 2026. All rights reserved. Proprietary software for JnanaNet Platform.
