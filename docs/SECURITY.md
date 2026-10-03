# JnanaNet V2 — Security Specification & Threat Model

## 1. Security Core Principles

JnanaNet V2 treats student data, financial records, identity documents, and cloud resources with zero-trust security standards.

---

## 2. Authentication & Authorization Security

1. **Password Hashing**:
   - Argon2id / Bcrypt with cost factor `12`.
   - Raw passwords never logged, indexed, or stored.

2. **Token Lifecycle**:
   - Access Token: Short-lived (15 minutes), passed as Bearer token in memory.
   - Refresh Token: Long-lived (7 days), stored in an `HttpOnly`, `SameSite=Strict`, `Secure` cookie. Token rotation enabled on every refresh call.

3. **Role-Based Access Control (RBAC)**:
   - Middleware enforces permissions (`RequireRole(['STUDENT'])`, `RequireRole(['ADMIN'])`).
   - Resource Ownership Verification: A student can only access or modify their own profile, applications, and documents (`WHERE user_id = req.user.id`).

---

## 3. Storage & Document Security (AWS S3)

1. **Private Buckets**:
   - `Block Public Access` enabled on AWS S3 bucket.
   - Files are inaccessible via direct URL.

2. **Presigned Upload & Download URLs**:
   - Direct-to-S3 presigned PUT URLs for uploads (expiring in 15 minutes).
   - Presigned GET URLs for viewing documents (expiring in 15 minutes).

3. **File Strict Validation**:
   - Allowed MIME types: `application/pdf`, `image/jpeg`, `image/png`.
   - Max file size limit: 5MB per document.
   - File extension & magic bytes verification before processing.

---

## 4. API & Application Security Controls

1. **CORS Restrictions**:
   - Explicit whitelist of allowed origins (e.g. `https://app.jnananet.in`, `http://localhost:5173` in dev).
   - Wildcards (`*`) strictly prohibited.

2. **Rate Limiting**:
   - Global rate limiter: 100 requests per 15-minute window per IP.
   - Auth endpoint rate limiter: 5 attempts per 15-minute window per IP.
   - AI assistant rate limiter: 10 queries per minute per user.

3. **Request Validation**:
   - All incoming API request bodies, params, and queries validated against strict Zod schemas.
   - Extra properties stripped automatically.

4. **Security Headers (Helmet.js)**:
   - `Content-Security-Policy` (CSP)
   - `Strict-Transport-Security` (HSTS)
   - `X-Frame-Options: DENY` (Anti-Clickjacking)
   - `X-Content-Type-Options: nosniff`

5. **OWASP Top 10 Mitigation Matrix**:
   - **SQL Injection**: Prevented via Prisma ORM parameterized query generation.
   - **XSS**: Sanitized inputs and automated React DOM string escaping.
   - **CSRF**: Mitigated via `SameSite=Strict` cookies and custom header validation.
   - **Sensitive Data Exposure**: Secrets injected via env vars, never committed to Git (`.gitignore` enforced).

---

## 5. Audit Logging & Compliance

- Sensitive actions (Password change, Document deletion, Application submission, Profile update) logged to `audit_logs` with IP, timestamp, user agent, and action payload.
- System error logs anonymized without logging PII (Personally Identifiable Information) or plain text secrets.
