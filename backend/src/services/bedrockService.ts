import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { env } from "../config/env";
import { logger } from "../utils/logger";
import { DeterministicEvaluationResult } from "./eligibilityEngine";

export interface BedrockGuidanceRequest {
  question: string;
  language?: string;
  studentContext?: {
    fullName?: string;
    courseName?: string;
    scoreObtained?: number;
    annualFamilyIncome?: number;
    state?: string;
    category?: string;
  };
  evaluationContext?: DeterministicEvaluationResult[];
}

export function generateDynamicBedrockMock(request: BedrockGuidanceRequest): string {
  const q = request.question.toLowerCase();
  const name = request.studentContext?.fullName || "Student";
  const course = request.studentContext?.courseName || "B.Tech";
  const marks = request.studentContext?.scoreObtained || 80;
  const income = request.studentContext?.annualFamilyIncome || 300000;

  if (q.includes("document") || q.includes("certificate") || q.includes("aadhaar") || q.includes("bonafide")) {
    return `### JnanaNet AI Guidance — Required Documents Checklist

1. **Direct Answer**
Hello ${name}! For scholarship applications in India (including NSP, AICTE, and private schemes), you must maintain clear scanned copies of official identity and income records.

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
Hello ${name}! The National Scholarship Portal (NSP) is the central government portal for Central Sector and Ministry schemes.

2. **Application Steps**
- **Step 1**: Register at \`scholarships.gov.in\` with your Aadhaar and mobile number.
- **Step 2**: Fill in academic details (${course}) and select scheme (e.g. Central Sector Scheme for College and University Students).
- **Step 3**: Upload valid Income Certificate (family income ≤ ₹${income.toLocaleString("en-IN")}) and Bonafide Certificate.
- **Step 4**: Submit application for Institute-level Verification (INO).

3. **Important Advisory**
- Submit your application at least **7 days before the closing deadline** to allow time for Institute Verification.`;
  }

  if (q.includes("pragati") || q.includes("aicte") || q.includes("girl") || q.includes("female") || q.includes("women")) {
    return `### JnanaNet AI Guidance — AICTE Pragati & Women Scholarships

1. **Direct Answer**
Hello ${name}! The **AICTE Pragati Scholarship Scheme** is specially designed to empower female students pursuing technical degree (${course}) or diploma courses.

2. **Scheme Highlights**
- **Financial Award**: ₹50,000 per annum towards college fees, books, and equipment.
- **Min Academic Score**: 60% or above in qualifying examination (Your score: ${marks}%).
- **Max Annual Income Limit**: ₹8,00,000 per annum (Your family income: ₹${income.toLocaleString("en-IN")}).
- **Eligibility**: Reserved for female students admitted to 1st year B.Tech/Diploma in AICTE-approved institutions.

3. **Recommended Action**
Ensure your family income certificate is updated and keep your AICTE admission allotment letter ready.`;
  }

  if (q.includes("income") || q.includes("lakh") || q.includes("low income") || q.includes("ews") || q.includes("3 lakh") || q.includes("2.5")) {
    return `### JnanaNet AI Guidance — Scholarships for Low-Income Families

1. **Direct Answer**
Hello ${name}! Based on your annual family income of ₹${income.toLocaleString("en-IN")}, you qualify for multiple high-priority central and corporate scholarships.

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
Hello ${name}! As a student enrolled in ${course}, you qualify for the broadest selection of high-value scholarships in India.

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

  return `### JnanaNet AI Assistant Guidance

1. **Direct Answer**
Hello ${name}! Regarding your inquiry "${request.question}", our intelligence engine has analyzed your profile context (${course}, Score: ${marks}%, Income: ₹${income.toLocaleString("en-IN")}).

2. **Personalized Analysis**
- **Matched Opportunities**: You qualify for Central Sector NSP Schemes, Reliance Foundation, and Tata Trusts based on your academic profile.
- **Key Eligibility Drivers**: Academic score, family income slab, domicile state, and technical course alignment.

3. **Action Checklist**
- Keep your scanned Income Certificate and Aadhaar Card ready.
- Verify your bank account is linked with Aadhaar for Direct Benefit Transfer (DBT).
- Explore the **What-If Simulator** tab to project how profile changes increase your eligibility score.`;
}

export class BedrockService {
  private static client = new BedrockRuntimeClient({
    region: env.AWS_REGION,
    credentials:
      env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY
        ? {
            accessKeyId: env.AWS_ACCESS_KEY_ID,
            secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
          }
        : undefined,
  });

  static buildPrompt({ question, language = "English", studentContext, evaluationContext }: BedrockGuidanceRequest): string {
    const profileSummary = studentContext
      ? `Student Profile Summary:
- Name: ${studentContext.fullName || "Student"}
- Course: ${studentContext.courseName || "Not specified"}
- Academic Score: ${studentContext.scoreObtained ? studentContext.scoreObtained + "%" : "Not specified"}
- Annual Family Income: ${studentContext.annualFamilyIncome ? "₹" + studentContext.annualFamilyIncome.toLocaleString("en-IN") : "Not specified"}
- Domicile State: ${studentContext.state || "Not specified"}
- Category: ${studentContext.category || "General"}`
      : "No student profile context provided.";

    const evalSummary = evaluationContext && evaluationContext.length > 0
      ? `Deterministic Eligibility Results:
${evaluationContext
  .map(
    (e) =>
      `• ${e.scholarshipTitle}: Status=${e.isEligible ? "ELIGIBLE" : "INELIGIBLE"} (${e.recommendationTag}, Score=${e.matchScore}/100)
  Passed: ${e.passedRules.join("; ") || "None"}
  Failed: ${e.failedRules.join("; ") || "None"}`
  )
  .join("\n")}`
      : "No specific scholarship evaluation provided.";

    return `You are JnanaNet V2, an expert AI Scholarship Assistant for Indian students.

${profileSummary}

${evalSummary}

Language Requirement: ${language}

Student Inquiry:
"${question}"

Provide a structured, encouraging, and highly practical answer formatted as follows:
1. Direct Answer & Summary
2. Relevant Scholarship Opportunities & Match Analysis
3. Document & Eligibility Action Items
4. Clear Next Step Strategy`;
  }

  static async generateGuidance(request: BedrockGuidanceRequest): Promise<string> {
    const prompt = this.buildPrompt(request);
    const modelId = env.BEDROCK_MODEL_ID;

    // Fallback if AWS credentials or model call fails in development/testing mode
    if (!env.AWS_ACCESS_KEY_ID || env.NODE_ENV === "test") {
      logger.info("Using Bedrock Service Dynamic Guidance Response (Dev/Test Mode)");
      return generateDynamicBedrockMock(request);
    }

    try {
      const isClaude = modelId.includes("anthropic");
      const requestBody = isClaude
        ? JSON.stringify({
            anthropic_version: "bedrock-2023-05-31",
            max_tokens: 1000,
            temperature: 0.5,
            messages: [{ role: "user", content: [{ type: "text", text: prompt }] }],
          })
        : JSON.stringify({
            inputText: prompt,
            textGenerationConfig: { maxTokenCount: 1000, temperature: 0.5 },
          });

      const command = new InvokeModelCommand({
        modelId,
        contentType: "application/json",
        accept: "application/json",
        body: requestBody,
      });

      const response = await this.client.send(command);
      const decoded = new TextDecoder().decode(response.body);
      const parsed = JSON.parse(decoded);

      if (isClaude) {
        return parsed?.content?.[0]?.text || "No AI response generated.";
      }

      return parsed?.results?.[0]?.outputText || parsed?.outputText || "No AI response generated.";
    } catch (error) {
      logger.error("Amazon Bedrock API Call Failed:", error);
      throw new Error("Failed to generate AI scholarship guidance from Amazon Bedrock");
    }
  }
}
