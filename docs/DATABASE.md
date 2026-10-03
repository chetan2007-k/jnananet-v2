# JnanaNet V2 — Relational Database Schema (PostgreSQL)

## 1. Schema Overview

The database is built on PostgreSQL using normalized 3NF structures. It guarantees data integrity, performance indexing, soft deletes, and automated timestamp tracking.

---

## 2. Entity Relationship Diagram (Conceptual)

```
[users] 1 ──── 1 [student_profiles] 1 ──── 1 [academic_records]
   │                      │
   │ 1                    │ 1
   ├──────────┐           ├────────────── 1 [financial_profiles]
   │          │           │
   │ 1        │ 1         │ 1
[audit_logs]  [notifications] ── 1..N [student_documents]
                          │
                          │ 1..N
               [scholarship_matches] N ──── 1 [scholarships]
                          │                       │ 1..N
                          │ 1..N                  ├─────── [scholarship_criteria]
                    [applications] 1              ├─────── [scholarship_deadlines]
                          │                       └─────── [scholarship_documents]
                          │ 1..N
              [application_documents]
                          │ 1..N
                    [ai_analysis]
```

---

## 3. Detailed Table Definitions

### 3.1. `users`
Stores login credentials, system roles, and account status.
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'STUDENT', -- 'STUDENT', 'ADMIN', 'REVIEWER'
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE', -- 'ACTIVE', 'SUSPENDED'
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
```

### 3.2. `student_profiles`
Core personal demographic profile.
```sql
CREATE TABLE student_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  date_of_birth DATE,
  gender VARCHAR(20),
  category VARCHAR(50) NOT NULL DEFAULT 'General', -- 'General', 'OBC', 'SC', 'ST', 'EWS'
  state VARCHAR(100) NOT NULL,
  district VARCHAR(100) NOT NULL,
  pincode VARCHAR(10),
  is_differently_abled BOOLEAN DEFAULT FALSE,
  disability_percentage NUMERIC(5,2),
  single_girl_child BOOLEAN DEFAULT FALSE,
  profile_photo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_student_profiles_state_cat ON student_profiles(state, category);
```

### 3.3. `academic_records`
Academic status and marks history.
```sql
CREATE TABLE academic_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_profile_id UUID UNIQUE NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
  current_level VARCHAR(100) NOT NULL, -- 'Undergraduate', 'Postgraduate', 'Diploma', 'School'
  course_name VARCHAR(255) NOT NULL, -- 'B.Tech', 'B.Sc', 'MBBS'
  specialization VARCHAR(255),
  institution_name VARCHAR(255) NOT NULL,
  board_or_university VARCHAR(255) NOT NULL,
  year_of_study INT NOT NULL DEFAULT 1,
  grade_type VARCHAR(20) NOT NULL DEFAULT 'PERCENTAGE', -- 'PERCENTAGE', 'CGPA'
  score_obtained NUMERIC(5,2) NOT NULL, -- e.g. 85.50
  max_score NUMERIC(5,2) NOT NULL DEFAULT 100.00,
  tenth_percentage NUMERIC(5,2),
  twelfth_percentage NUMERIC(5,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_academic_course_score ON academic_records(course_name, score_obtained);
```

### 3.4. `financial_profiles`
Family financial standing and verification indicators.
```sql
CREATE TABLE financial_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_profile_id UUID UNIQUE NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
  annual_family_income NUMERIC(12,2) NOT NULL,
  father_occupation VARCHAR(100),
  mother_occupation VARCHAR(100),
  has_income_certificate BOOLEAN DEFAULT FALSE,
  income_certificate_number VARCHAR(100),
  income_certificate_issuer VARCHAR(150),
  certificate_issued_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_financial_income ON financial_profiles(annual_family_income);
```

### 3.5. `scholarships`
Master catalog of available scholarships.
```sql
CREATE TABLE scholarships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  provider VARCHAR(255) NOT NULL, -- 'Government of India', 'Reliance Foundation', etc.
  category VARCHAR(100) NOT NULL, -- 'Government', 'Private', 'Corporate', 'Institutional'
  description TEXT NOT NULL,
  award_amount NUMERIC(12,2) NOT NULL,
  award_details TEXT,
  official_url TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_scholarships_active ON scholarships(is_active);
```

### 3.6. `scholarship_criteria`
Structured criteria constraints for the deterministic eligibility engine.
```sql
CREATE TABLE scholarship_criteria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scholarship_id UUID NOT NULL REFERENCES scholarships(id) ON DELETE CASCADE,
  min_academic_score NUMERIC(5,2) DEFAULT 0,
  max_family_income NUMERIC(12,2) DEFAULT 999999999,
  allowed_courses JSONB NOT NULL DEFAULT '["ALL"]', -- ["B.Tech", "M.Tech", "B.Sc"]
  allowed_states JSONB NOT NULL DEFAULT '["ALL"]', -- ["Tamil Nadu", "Andhra Pradesh"]
  allowed_categories JSONB NOT NULL DEFAULT '["ALL"]', -- ["SC", "ST", "OBC", "General"]
  gender_restriction VARCHAR(20) DEFAULT 'ALL', -- 'FEMALE_ONLY', 'MALE_ONLY', 'ALL'
  disability_required BOOLEAN DEFAULT FALSE,
  custom_rules JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_scholarship_criteria_fk ON scholarship_criteria(scholarship_id);
```

### 3.7. `scholarship_deadlines`
Deadline management and application cycle tracking.
```sql
CREATE TABLE scholarship_deadlines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scholarship_id UUID NOT NULL REFERENCES scholarships(id) ON DELETE CASCADE,
  academic_year VARCHAR(20) NOT NULL, -- '2026-2027'
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  extension_date DATE,
  is_extended BOOLEAN DEFAULT FALSE,
  status VARCHAR(50) NOT NULL DEFAULT 'UPCOMING', -- 'OPEN', 'CLOSING_SOON', 'CLOSED'
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_deadlines_end_date ON scholarship_deadlines(end_date, status);
```

### 3.8. `student_documents`
Student vault of uploaded identity & academic documents stored in AWS S3.
```sql
CREATE TABLE student_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_profile_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
  document_type VARCHAR(100) NOT NULL, -- 'AADHAAR', 'INCOME_CERT', 'MARKSHEET', 'BONAFIDE'
  file_name VARCHAR(255) NOT NULL,
  file_size INT NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  s3_key VARCHAR(512) NOT NULL,
  s3_bucket VARCHAR(255) NOT NULL,
  verification_status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'VERIFIED', 'REJECTED'
  ocr_extracted_data JSONB DEFAULT '{}',
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_student_docs_profile ON student_documents(student_profile_id, document_type);
```

### 3.9. `scholarship_matches`
Persisted deterministic rule evaluation & AI scoring results.
```sql
CREATE TABLE scholarship_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_profile_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
  scholarship_id UUID NOT NULL REFERENCES scholarships(id) ON DELETE CASCADE,
  is_deterministic_eligible BOOLEAN NOT NULL,
  match_score INT NOT NULL, -- 0 to 100
  passed_rules JSONB NOT NULL DEFAULT '[]',
  failed_rules JSONB NOT NULL DEFAULT '[]',
  ai_recommendation_tag VARCHAR(50), -- 'HIGH_PROBABILITY', 'STRONG_MATCH', 'STRETCH'
  ai_reasoning TEXT,
  calculated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unq_student_scholarship_match UNIQUE (student_profile_id, scholarship_id)
);

CREATE INDEX idx_matches_score ON scholarship_matches(student_profile_id, match_score DESC);
```

### 3.10. `applications`
Student application tracking system.
```sql
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_profile_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
  scholarship_id UUID NOT NULL REFERENCES scholarships(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL DEFAULT 'DRAFT', -- 'DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'ACCEPTED', 'REJECTED'
  readiness_score INT NOT NULL DEFAULT 0,
  submitted_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unq_student_app UNIQUE (student_profile_id, scholarship_id)
);

CREATE INDEX idx_applications_status ON applications(student_profile_id, status);
```

### 3.11. `ai_analysis`
Audit log and output store for Amazon Bedrock AI inferences.
```sql
CREATE TABLE ai_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  analysis_type VARCHAR(100) NOT NULL, -- 'ELIGIBILITY_EXPLANATION', 'DOCUMENT_OCR', 'CHAT_ASSISTANT'
  model_id VARCHAR(150) NOT NULL,
  prompt_summary TEXT,
  raw_response JSONB NOT NULL,
  token_count INT,
  latency_ms INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ai_analysis_type ON ai_analysis(analysis_type, created_at);
```

### 3.12. `notifications` & `audit_logs`
System notification inbox and security logging.
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL DEFAULT 'INFO', -- 'INFO', 'DEADLINE_ALERT', 'MATCH_ALERT'
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```
