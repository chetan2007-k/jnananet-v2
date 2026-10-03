# JnanaNet V2 — REST API Specification

## 1. Global API Standards

- **Base URL**: `/api/v2`
- **Format**: JSON (`Content-Type: application/json`)
- **Authentication**: `Authorization: Bearer <access_token>` (for protected endpoints)
- **Error Response Payload**:
  ```json
  {
    "success": false,
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Invalid email address or format",
      "details": [
        { "field": "email", "issue": "Must be a valid email address" }
      ]
    },
    "timestamp": "2026-09-13T10:00:00.000Z"
  }
  ```
- **Success Response Payload**:
  ```json
  {
    "success": true,
    "data": { ... },
    "meta": { "page": 1, "limit": 20, "total": 120 }
  }
  ```

---

## 2. API Endpoints Breakdown

### 2.1. Authentication (`/api/v2/auth`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/auth/register` | Public | Register new student account |
| `POST` | `/auth/login` | Public | Authenticate user & issue JWT tokens |
| `POST` | `/auth/refresh` | Public (Cookie) | Refresh access token using HttpOnly cookie |
| `POST` | `/auth/logout` | Protected | Clear session cookies & revoke tokens |
| `POST` | `/auth/forgot-password` | Public | Request signed password reset link |
| `POST` | `/auth/reset-password` | Public | Reset password with token validation |

### 2.2. Student Profile (`/api/v2/profile`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/profile` | Protected | Fetch current student profile, academic & financial info |
| `PUT` | `/profile/personal` | Protected | Update demographic & personal details |
| `PUT` | `/profile/academic` | Protected | Update academic records & grades |
| `PUT` | `/profile/financial` | Protected | Update family income & certificate details |
| `GET` | `/profile/strength` | Protected | Compute current profile completeness score (0-100%) |

### 2.3. Scholarships (`/api/v2/scholarships`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/scholarships` | Public/Protected | Search & filter scholarships catalog (Paginated) |
| `GET` | `/scholarships/:id` | Public/Protected | Get single scholarship details, rules & deadlines |
| `POST` | `/scholarships/compare` | Protected | Compare 2 to 4 scholarships side-by-side |

### 2.4. Eligibility Engine & Matching (`/api/v2/eligibility`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/eligibility/evaluate` | Protected | Run deterministic rules engine against user profile |
| `POST` | `/eligibility/explain` | Protected | Trigger Bedrock AI for personalized gap explanation |
| `POST` | `/eligibility/simulate` | Protected | Run "What-If" simulation on profile variables |

### 2.5. Documents Management (`/api/v2/documents`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/documents` | Protected | List student's uploaded vault documents |
| `POST` | `/documents/presigned-url` | Protected | Generate S3 presigned PUT URL for upload |
| `POST` | `/documents/confirm` | Protected | Confirm upload completion & save metadata |
| `GET` | `/documents/:id/download` | Protected | Get S3 presigned GET URL for viewing/download |
| `POST` | `/documents/:id/analyze` | Protected | Trigger AI OCR verification (Textract/Bedrock) |

### 2.6. Applications & Readiness (`/api/v2/applications`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/applications` | Protected | Track active & past scholarship applications |
| `POST` | `/applications` | Protected | Create new application draft for a scholarship |
| `PATCH` | `/applications/:id/status` | Protected | Update application status (`DRAFT`, `SUBMITTED`, etc.) |
| `GET` | `/applications/:id/readiness` | Protected | Compute application readiness score & missing steps |

### 2.7. AI Scholarship Assistant (`/api/v2/assistant`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/assistant/chat` | Protected | Send message to AI Assistant (Bedrock stateful stream) |
| `GET` | `/assistant/history` | Protected | Fetch past conversation transcript |

### 2.8. Dashboard & Analytics (`/api/v2/dashboard`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/dashboard/summary` | Protected | Fetch aggregated metric counters & top recommendations |
| `GET` | `/dashboard/deadlines` | Protected | Fetch upcoming closing deadlines |

---

## 3. Sample Payload Examples

### 3.1. `POST /api/v2/eligibility/evaluate`
**Request Body**:
```json
{
  "scholarshipId": "d3b07384-d113-4603-99b3-761376822c92"
}
```
**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "scholarshipId": "d3b07384-d113-4603-99b3-761376822c92",
    "scholarshipTitle": "NSP Central Sector Scheme",
    "isEligible": true,
    "matchScore": 88,
    "passedRules": [
      "Academic score 82% exceeds required minimum of 75%",
      "Annual family income ₹2,50,000 is below maximum threshold of ₹4,50,000",
      "Course B.Tech is explicitly supported",
      "Domicile Tamil Nadu is eligible"
    ],
    "failedRules": [],
    "recommendationTag": "HIGH_PROBABILITY"
  }
}
```

### 3.2. `POST /api/v2/documents/presigned-url`
**Request Body**:
```json
{
  "documentType": "INCOME_CERT",
  "fileName": "income_certificate_2026.pdf",
  "fileSize": 1048576,
  "mimeType": "application/pdf"
}
```
**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "documentId": "7e91a2bc-3312-4212-b912-321321312312",
    "uploadUrl": "https://jnananet-docs-private.s3.ap-south-1.amazonaws.com/uploads/student-123/income_cert.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&...",
    "expiresInSeconds": 900,
    "s3Key": "uploads/student-123/income_cert.pdf"
  }
}
```
