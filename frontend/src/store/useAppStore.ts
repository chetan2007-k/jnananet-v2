import { create } from "zustand";
import { Scholarship, StudentProfile, StudentDocument, Application } from "../types";

export type TabView =
  | "dashboard"
  | "scholarships"
  | "comparison"
  | "simulator"
  | "identity"
  | "calendar"
  | "assistant"
  | "applications";

interface AppState {
  activeTab: TabView;
  setActiveTab: (tab: TabView) => void;
  
  // Student Profile State
  profile: StudentProfile;
  updateProfile: (profile: Partial<StudentProfile>) => void;

  // Comparison drawer & list
  comparisonList: Scholarship[];
  addToComparison: (scholarship: Scholarship) => void;
  removeFromComparison: (scholarshipId: string) => void;
  clearComparison: () => void;

  // Selected scholarship for modal details
  selectedScholarship: Scholarship | null;
  setSelectedScholarship: (scholarship: Scholarship | null) => void;

  // Documents Vault
  documents: StudentDocument[];
  addDocument: (doc: StudentDocument) => void;
  removeDocument: (id: string) => void;

  // Applications
  applications: Application[];
  addApplication: (app: Application) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeTab: "dashboard",
  setActiveTab: (tab) => set({ activeTab: tab }),

  profile: {
    id: "profile-demo-1",
    fullName: "Aarav Chenna",
    phone: "+91 98765 43210",
    dateOfBirth: "2005-04-12",
    gender: "MALE",
    category: "GENERAL",
    state: "Tamil Nadu",
    district: "Chennai",
    pincode: "600001",
    isDifferentlyAbled: false,
    academicRecord: {
      currentLevel: "Undergraduate",
      courseName: "B.Tech Computer Science",
      institutionName: "Anna University Campus",
      boardOrUniversity: "Anna University",
      yearOfStudy: 2,
      scoreObtained: 82.5,
      maxScore: 100,
    },
    financialProfile: {
      annualFamilyIncome: 280000,
      fatherOccupation: "Private Employee",
      motherOccupation: "Homemaker",
      hasIncomeCertificate: true,
    },
  },

  updateProfile: (updated) =>
    set((state) => ({
      profile: { ...state.profile, ...updated },
    })),

  comparisonList: [],
  addToComparison: (scholarship) =>
    set((state) => {
      if (state.comparisonList.some((s) => s.id === scholarship.id)) return state;
      if (state.comparisonList.length >= 4) return state;
      return { comparisonList: [...state.comparisonList, scholarship] };
    }),

  removeFromComparison: (scholarshipId) =>
    set((state) => ({
      comparisonList: state.comparisonList.filter((s) => s.id !== scholarshipId),
    })),

  clearComparison: () => set({ comparisonList: [] }),

  selectedScholarship: null,
  setSelectedScholarship: (scholarship) => set({ selectedScholarship: scholarship }),

  documents: [
    {
      id: "doc-aadhaar-1",
      documentType: "AADHAAR",
      fileName: "aarav_aadhaar_card.pdf",
      fileSize: 1024 * 850,
      mimeType: "application/pdf",
      verificationStatus: "VERIFIED",
      uploadedAt: "2026-08-10T10:00:00Z",
    },
    {
      id: "doc-income-2",
      documentType: "INCOME_CERT",
      fileName: "income_certificate_2026.pdf",
      fileSize: 1024 * 1200,
      mimeType: "application/pdf",
      verificationStatus: "VERIFIED",
      uploadedAt: "2026-08-12T14:30:00Z",
    },
  ],
  addDocument: (doc) => set((state) => ({ documents: [doc, ...state.documents] })),
  removeDocument: (id) => set((state) => ({ documents: state.documents.filter(d => d.id !== id) })),

  applications: [
    {
      id: "app-1",
      scholarshipId: "schol-nsp-01",
      scholarshipTitle: "National Scholarship Portal - Central Sector Scheme",
      provider: "Government of India",
      awardAmount: 12000,
      status: "SUBMITTED",
      readinessScore: 100,
      submittedAt: "2026-09-01T09:15:00Z",
    },
    {
      id: "app-2",
      scholarshipId: "schol-reliance-02",
      scholarshipTitle: "Reliance Foundation Undergraduate Scholarship",
      provider: "Reliance Foundation",
      awardAmount: 200000,
      status: "DRAFT",
      readinessScore: 85,
    },
  ],
  addApplication: (app) => set((state) => ({ applications: [app, ...state.applications] })),
}));
