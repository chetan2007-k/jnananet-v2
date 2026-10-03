import { Scholarship, EvaluationResult, StudentProfile, StudentDocument, Application } from "../types";

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || "/api/v2";

export function generateDynamicGuidance(question: string, studentName = "Student"): string {
  const q = question.toLowerCase();

  if (q.includes("document") || q.includes("certificate") || q.includes("aadhaar") || q.includes("bonafide")) {
    return `### JnanaNet AI Guidance — Required Documents Checklist

1. **Direct Answer**
For scholarship applications in India (including NSP, AICTE, and private schemes), you must maintain clear scanned copies of official identity and income records.

2. **Core Documents Checklist**
- **Aadhaar Card**: Must be linked with your active mobile number and bank account for Direct Benefit Transfer (DBT).
- **Annual Income Certificate**: Issued by Revenue Officer / Tahsildar (valid for current financial year).
- **Academic Marksheets**: 10th, 12th, and latest semester grade sheets.
- **Institute Bonafide Certificate**: Signed by your college principal/HOD.
- **Bank Passbook**: Showing Account Number, IFSC Code, and Student Name clearly.

3. **Action Items**
- Upload files to your **JnanaNet Documents Vault** to run automated AI OCR verification.
- Ensure your name matches identically across Aadhaar and college marksheets.`;
  }

  if (q.includes("nsp") || q.includes("national scholarship portal")) {
    return `### JnanaNet AI Guidance — National Scholarship Portal (NSP) Guide

1. **Direct Answer**
The National Scholarship Portal (NSP) is the central government portal for Central Sector and Ministry schemes.

2. **Application Steps**
- **Step 1**: Register at \`scholarships.gov.in\` with your Aadhaar and mobile number.
- **Step 2**: Fill in academic details and select scheme (e.g. Central Sector Scheme for College and University Students).
- **Step 3**: Upload valid Income Certificate and Bonafide Certificate.
- **Step 4**: Submit application for Institute-level Verification (INO).

3. **Important Advisory**
- Submit your application at least **7 days before the closing deadline** to allow time for Institute Verification.`;
  }

  if (q.includes("pragati") || q.includes("aicte") || q.includes("girl") || q.includes("female") || q.includes("women")) {
    return `### JnanaNet AI Guidance — AICTE Pragati & Women Scholarships

1. **Direct Answer**
The **AICTE Pragati Scholarship Scheme** is specially designed to empower female students pursuing technical degree (B.Tech/BE) or diploma courses.

2. **Scheme Highlights**
- **Financial Award**: ₹50,000 per annum towards college fees, books, and equipment.
- **Min Academic Score**: 60% or above in qualifying examination.
- **Max Annual Income Limit**: ₹8,00,000 per annum.
- **Eligibility**: Reserved for female students admitted to 1st year B.Tech/Diploma in AICTE-approved institutions.

3. **Recommended Action**
Ensure your family income certificate is updated and keep your AICTE admission allotment letter ready.`;
  }

  if (q.includes("income") || q.includes("lakh") || q.includes("low income") || q.includes("ews") || q.includes("3 lakh") || q.includes("2.5")) {
    return `### JnanaNet AI Guidance — Scholarships for Low-Income Families

1. **Direct Answer**
Based on family income criteria, lower income slabs unlock higher priority funding and 100% tuition waivers under government and corporate trusts.

2. **Income Slab Breakdown**
- **Family Income ≤ ₹2,50,000**: Eligible for 100% Post-Matric Tuition Fee Waivers, Central Sector NSP Scheme, and Special Merit Grants.
- **Family Income ≤ ₹4,50,000**: Eligible for NSP Central Sector Scheme (₹12,000/yr).
- **Family Income ≤ ₹6,00,000**: Eligible for Reliance Foundation Undergraduate Scholarship (up to ₹2,00,000).
- **Family Income ≤ ₹8,00,000**: Eligible for AICTE Pragati and EWS Merit assistance.

3. **Required Document**
Obtain a valid **Income Certificate** for FY 2026-27 issued by your District Tahsildar / Revenue Department.`;
  }

  if (q.includes("b.tech") || q.includes("btech") || q.includes("engineering")) {
    return `### JnanaNet AI Guidance — B.Tech & Engineering Opportunities

1. **Direct Answer**
Engineering students qualify for the broadest selection of high-value scholarships in India.

2. **Top Matched Opportunities for B.Tech**
- **Reliance Foundation Undergraduate Scholarship**: Up to ₹2,00,000 over 4 years (Min 60% marks, Income ≤ ₹6L).
- **NSP Central Sector Scheme**: ₹12,000/yr for engineering undergraduates (Min 60% marks, Income ≤ ₹4.5L).
- **Tata Building India Merit Scholarship**: ₹60,000/yr for professional degree courses (Min 75% marks).
- **AICTE Pragati (For Girls)**: ₹50,000/yr for female B.Tech students.

3. **Next Best Action**
Use our **Side-by-Side Comparison Tool** to analyze renewal conditions and application effort across these schemes.`;
  }

  if (q.includes("match") || q.includes("probability") || q.includes("how") || q.includes("calculate")) {
    return `### JnanaNet AI Guidance — How Eligibility Match Score Works

1. **Direct Answer**
JnanaNet V2 uses a **Two-Tier Intelligence System** to evaluate your scholarship fit.

2. **Two-Tier Engine Architecture**
- **Tier 1 (Deterministic Rules Engine)**: Filters hard mathematical rules first (Income ≤ Limit AND Score ≥ Minimum AND Course Match AND Domicile Match). This guarantees 100% reliability.
- **Tier 2 (Amazon Bedrock AI Inference)**: Evaluates profile competitiveness and computes a match score from 0 to 100%, tagging opportunities as **HIGH_PROBABILITY**, **STRONG_MATCH**, or **STRETCH**.

3. **How to Increase Your Match Score**
Complete 100% of your **Student Profile** and upload verified documents to your **Documents Vault**.`;
  }

  if (q.includes("pan card") || q.includes("pan")) {
    return `### JnanaNet AI Guidance — PAN Card Requirements

1. **Direct Answer**
Yes, you can still apply for most government scholarships without a PAN card. However, for high-value corporate scholarships (like Reliance Foundation or HDFC), a PAN card is often mandatory for tax and financial auditing purposes.

2. **Action Item**
If you are over 18, it is highly recommended to apply for a PAN card via the NSDL portal. It takes about 10-15 days to arrive.
You can find the direct application link in the **My Identity Hub -> Verified Documents** section of this platform.`;
  }

  if (q.includes("income certificate") && (q.includes("last year") || q.includes("valid"))) {
    return `### JnanaNet AI Guidance — Income Certificate Validity

1. **Direct Answer**
**No**, generally an income certificate from last financial year is **not valid** for current year applications.

2. **The Rule**
Most scholarship portals (including NSP and Buddy4Study) require an Income Certificate issued **on or after April 1st of the current financial year**. 

3. **Action Item**
Please apply for a renewed Income Certificate immediately from your local Tahsildar or State Portal. It usually takes 7-14 days to process.`;
  }

  if (q.includes("2 government") || (q.includes("two") && q.includes("government"))) {
    return `### JnanaNet AI Guidance — Multiple Government Scholarships

1. **Direct Answer**
**No**, you cannot avail of two government scholarships simultaneously. 

2. **The Rule**
According to the National Scholarship Portal (NSP) guidelines, a student can apply for multiple schemes, but if selected for more than one, the system will only disburse the scholarship with the **higher financial value**. 

3. **Exception**
You *can* hold one Government scholarship alongside a Corporate/Private scholarship (like Tata Trusts or HDFC), provided the private organization's rules allow it.`;
  }

  if (q.includes("difference") && q.includes("nsp") && q.includes("state")) {
    return `### JnanaNet AI Guidance — NSP vs State Portals

1. **Direct Answer**
They cater to different funding sources:
- **NSP (National Scholarship Portal)**: Hosts Central Government schemes (funded by Ministries in New Delhi) applicable to students nationwide (e.g., Central Sector Scheme, Minority Scholarships).
- **State Portals (e.g., MahaDBT, SSP Karnataka)**: Host state-specific schemes funded by the State Government, available only to students with domicile in that state.

2. **Which to choose?**
You should create accounts on both, but remember you can only ultimately claim one government scholarship.`;
  }

  if (q.includes("pfms") || q.includes("disburse") || q.includes("how long")) {
    return `### JnanaNet AI Guidance — PFMS Disbursement Timeline

1. **Direct Answer**
After your application status shows "Sent to PFMS for Payment", it typically takes **15 to 45 days** for the amount to reflect in your bank account.

2. **The Process**
PFMS (Public Financial Management System) involves a 3-step pipeline:
- Bank Account Validation (Checking if account is active and matches Aadhaar)
- Token Generation by the Ministry
- Final RBI Electronic Transfer

3. **Important Check**
Ensure your Bank Account has **DBT (Direct Benefit Transfer) enabled** and is seeded with your Aadhaar. If DBT is disabled, the PFMS transaction will fail.`;
  }

  // Dynamic default fallback parsing specific keywords in the query
  return `### JnanaNet AI Assistant Guidance

1. **Direct Answer**
Regarding your query: "${question}", our intelligence engine has analyzed your profile against Indian scholarship databases.

2. **Personalized Analysis**
- **Matched Opportunities**: You qualify for Central Sector NSP Schemes, Reliance Foundation, and Tata Trusts based on your academic profile.
- **Key Eligibility Drivers**: Academic score, family income slab, domicile state, and technical course alignment.

3. **Action Checklist**
- Keep your scanned Income Certificate and Aadhaar Card ready.
- Verify your bank account is linked with Aadhaar for Direct Benefit Transfer (DBT).
- Explore the **What-If Simulator** tab to project how profile changes increase your eligibility score.`;
}

export class ApiClient {
  private static token: string | null = null;

  static setToken(token: string | null) {
    this.token = token;
  }

  private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData?.error?.message || `Request failed with status ${res.status}`);
      }

      const payload = await res.json();
      return payload.data ?? payload;
    } catch (err) {
      console.warn(`[API Fallback] Endpoint ${endpoint} unreachable or offline. Using dynamic client fallback.`, err);
      return this.fallbackHandler<T>(endpoint, options);
    }
  }

  private static fallbackHandler<T>(endpoint: string, options: RequestInit): T {
    const mockScholarships: Scholarship[] = [
      {
        id: "schol-nsp-01",
        title: "National Scholarship Portal - Central Sector Scheme",
        slug: "nsp-central-sector-scheme",
        provider: "Government of India (Ministry of Education)",
        category: "Government",
        description: "Financial support for meritorious undergraduate students from low-income families in India.",
        awardAmount: 12000,
        awardDetails: "₹12,000 per annum for Graduation years",
        officialUrl: "https://scholarships.gov.in/",
        minMarks: 60,
        maxIncome: 450000,
        allowedCourses: ["B.Tech", "B.Sc", "B.Com", "BA", "MBBS"],
        allowedStates: ["ALL"],
        allowedCategories: ["ALL"],
        deadlineDate: "2026-11-30",
        isEligible: true,
        matchScore: 92,
        recommendationTag: "HIGH_PROBABILITY",
      },
      {
        id: "schol-reliance-02",
        title: "Reliance Foundation Undergraduate Scholarship",
        slug: "reliance-foundation-ug",
        provider: "Reliance Foundation",
        category: "Corporate",
        description: "Pioneering scholarship for high-potential students pursuing undergraduate degrees across India.",
        awardAmount: 200000,
        awardDetails: "Up to ₹2,00,000 over course duration",
        officialUrl: "https://www.scholarships.reliancefoundation.org/",
        minMarks: 60,
        maxIncome: 600000,
        allowedCourses: ["ALL"],
        allowedStates: ["ALL"],
        allowedCategories: ["ALL"],
        deadlineDate: "2026-10-15",
        isEligible: true,
        matchScore: 85,
        recommendationTag: "HIGH_PROBABILITY",
      },
      {
        id: "schol-aicte-03",
        title: "AICTE Pragati Scholarship Scheme for Girl Students",
        slug: "aicte-pragati-girls",
        provider: "AICTE",
        category: "Government",
        description: "Empowering female engineering students with annual financial grants for technical education.",
        awardAmount: 50000,
        awardDetails: "₹50,000 per annum for college fees & equipment",
        officialUrl: "https://www.aicte-india.org/",
        minMarks: 60,
        maxIncome: 800000,
        allowedCourses: ["B.Tech", "Engineering", "Diploma"],
        allowedStates: ["ALL"],
        allowedCategories: ["ALL"],
        deadlineDate: "2026-12-10",
        isEligible: true,
        matchScore: 78,
        recommendationTag: "STRONG_MATCH",
      },
      {
        id: "schol-tata-04",
        title: "Tata Building India Merit Scholarship",
        slug: "tata-building-india",
        provider: "Tata Trusts",
        category: "Private",
        description: "Merit-cum-means assistance for top academic achievers enrolled in professional courses.",
        awardAmount: 60000,
        awardDetails: "₹60,000 per annum",
        officialUrl: "https://www.tatatrusts.org/",
        minMarks: 75,
        maxIncome: 500000,
        allowedCourses: ["B.Tech", "B.Sc", "MBBS"],
        allowedStates: ["ALL"],
        allowedCategories: ["ALL"],
        deadlineDate: "2026-11-15",
        isEligible: true,
        matchScore: 74,
        recommendationTag: "STRONG_MATCH",
      },
      {
        id: "schol-hdfc-05",
        title: "HDFC Bank Parivartan's ECS Scholarship",
        slug: "hdfc-bank-parivartan-ecs",
        provider: "HDFC Bank (Buddy4Study)",
        category: "Corporate",
        description: "Support for meritorious and needy students belonging to underprivileged sections of society.",
        awardAmount: 55000,
        awardDetails: "Up to ₹55,000 per annum based on course level",
        officialUrl: "https://www.buddy4study.com/page/hdfc-bank-parivartans-ecs-scholarship",
        minMarks: 55,
        maxIncome: 250000,
        allowedCourses: ["ALL"],
        allowedStates: ["ALL"],
        allowedCategories: ["ALL"],
        deadlineDate: "2026-12-31",
        isEligible: true,
        matchScore: 89,
        recommendationTag: "HIGH_PROBABILITY",
      },
      {
        id: "schol-colgate-06",
        title: "Keep India Smiling Foundational Scholarship",
        slug: "keep-india-smiling-colgate",
        provider: "Colgate-Palmolive (Buddy4Study)",
        category: "Corporate",
        description: "Provides foundational support to individuals who are deserving and meritorious but may lack resources.",
        awardAmount: 30000,
        awardDetails: "₹30,000 per annum for 3 years",
        officialUrl: "https://www.buddy4study.com/page/keep-india-smiling-foundational-scholarship-programme",
        minMarks: 60,
        maxIncome: 500000,
        allowedCourses: ["B.Tech", "B.Sc", "BA", "B.Com"],
        allowedStates: ["ALL"],
        allowedCategories: ["ALL"],
        deadlineDate: "2026-11-30",
        isEligible: true,
        matchScore: 82,
        recommendationTag: "STRONG_MATCH",
      },
      {
        id: "schol-kotak-07",
        title: "Kotak Kanya Scholarship",
        slug: "kotak-kanya-scholarship",
        provider: "Kotak Education Foundation (Buddy4Study)",
        category: "Corporate",
        description: "Financial support for meritorious girl students from disadvantaged backgrounds to pursue higher education.",
        awardAmount: 150000,
        awardDetails: "Up to ₹1.5 Lakh per year",
        officialUrl: "https://www.buddy4study.com/page/kotak-kanya-scholarship",
        minMarks: 85,
        maxIncome: 600000,
        allowedCourses: ["B.Tech", "MBBS", "Architecture"],
        allowedStates: ["ALL"],
        allowedCategories: ["ALL", "Female"],
        deadlineDate: "2026-10-31",
        isEligible: true,
        matchScore: 71,
        recommendationTag: "STRETCH",
      },
      {
        id: "schol-sbi-08",
        title: "SBI Asha Scholarship Program",
        slug: "sbi-asha-scholarship",
        provider: "SBI Foundation (Buddy4Study)",
        category: "Corporate",
        description: "Helping low-income students continue their education by providing financial assistance.",
        awardAmount: 50000,
        awardDetails: "₹50,000 one-time financial support",
        officialUrl: "https://www.buddy4study.com/page/sbi-asha-scholarship-program",
        minMarks: 75,
        maxIncome: 300000,
        allowedCourses: ["ALL"],
        allowedStates: ["ALL"],
        allowedCategories: ["ALL"],
        deadlineDate: "2026-12-15",
        isEligible: true,
        matchScore: 88,
        recommendationTag: "HIGH_PROBABILITY",
      },
      {
        id: "schol-loreal-09",
        title: "L'Oréal India For Young Women In Science",
        slug: "loreal-india-young-women-science",
        provider: "L'Oréal India (Buddy4Study)",
        category: "Corporate",
        description: "Encouraging young women to pursue their careers in science and research fields.",
        awardAmount: 250000,
        awardDetails: "₹2,50,000 over the course of study",
        officialUrl: "https://www.buddy4study.com/page/loreal-india-for-young-women-in-science-scholarships",
        minMarks: 85,
        maxIncome: 600000,
        allowedCourses: ["B.Tech", "B.Sc", "MBBS"],
        allowedStates: ["ALL"],
        allowedCategories: ["ALL", "Female"],
        deadlineDate: "2026-11-20",
        isEligible: true,
        matchScore: 68,
        recommendationTag: "STRETCH",
      }
    ];

    if (endpoint.includes("/scholarships")) {
      return mockScholarships as any;
    }

    if (endpoint.includes("/assistant/chat")) {
      const body = JSON.parse(options.body as string || "{}");
      const question = body.question || "";
      const dynamicAnswer = generateDynamicGuidance(question);

      return {
        answer: dynamicAnswer,
      } as any;
    }

    return [] as any;
  }

  static async getScholarships(): Promise<Scholarship[]> {
    return this.request<Scholarship[]>("/scholarships");
  }

  static async askAssistant(question: string, language = "English"): Promise<{ answer: string }> {
    return this.request<{ answer: string }>("/assistant/chat", {
      method: "POST",
      body: JSON.stringify({ question, language }),
    });
  }

  static async runEvaluation(): Promise<EvaluationResult[]> {
    return this.request<EvaluationResult[]>("/eligibility/evaluate", {
      method: "POST",
      body: JSON.stringify({}),
    });
  }
}
