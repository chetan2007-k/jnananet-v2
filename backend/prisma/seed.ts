import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding JnanaNet V2 B.Tech Scholarship Catalog & Criteria...");

  // Seed 1: NSP Central Sector Scheme
  await prisma.scholarship.upsert({
    where: { slug: "nsp-central-sector-scheme" },
    update: {},
    create: {
      title: "National Scholarship Portal - Central Sector Scheme",
      slug: "nsp-central-sector-scheme",
      provider: "Government of India (Ministry of Education)",
      category: "Government",
      description: "Financial assistance for meritorious students from low-income families to pursue higher education.",
      awardAmount: 12000.0,
      awardDetails: "₹12,000 per annum for Graduation & ₹20,000 per annum for Post Graduation.",
      officialUrl: "https://scholarships.gov.in/",
      isActive: true,
      criteria: {
        create: {
          minAcademicScore: 60.0,
          maxFamilyIncome: 450000.0,
          allowedCourses: ["B.Tech", "B.Sc", "B.Com", "BA", "MBBS"],
          allowedStates: ["ALL"],
          allowedCategories: ["ALL"],
          genderRestriction: "ALL",
        },
      },
      deadlines: {
        create: {
          academicYear: "2026-2027",
          startDate: new Date("2026-08-01"),
          endDate: new Date("2026-11-30"),
          status: "OPEN",
        },
      },
    },
  });

  // Seed 2: Reliance Foundation Undergraduate Scholarship
  await prisma.scholarship.upsert({
    where: { slug: "reliance-foundation-ug-scholarship" },
    update: {},
    create: {
      title: "Reliance Foundation Undergraduate Scholarship",
      slug: "reliance-foundation-ug-scholarship",
      provider: "Reliance Foundation",
      category: "Corporate",
      description: "Empowering meritorious undergraduate students in any discipline across India.",
      awardAmount: 200000.0,
      awardDetails: "Up to ₹2,00,000 over the duration of the degree course.",
      officialUrl: "https://www.scholarships.reliancefoundation.org/",
      isActive: true,
      criteria: {
        create: {
          minAcademicScore: 60.0,
          maxFamilyIncome: 600000.0,
          allowedCourses: ["ALL"],
          allowedStates: ["ALL"],
          allowedCategories: ["ALL"],
          genderRestriction: "ALL",
        },
      },
      deadlines: {
        create: {
          academicYear: "2026-2027",
          startDate: new Date("2026-09-01"),
          endDate: new Date("2026-10-15"),
          status: "OPEN",
        },
      },
    },
  });

  // Seed 3: AICTE Pragati Scholarship for Girls
  await prisma.scholarship.upsert({
    where: { slug: "aicte-pragati-scholarship-girls" },
    update: {},
    create: {
      title: "AICTE Pragati Scholarship Scheme for Girl Students",
      slug: "aicte-pragati-scholarship-girls",
      provider: "AICTE",
      category: "Government",
      description: "Supporting young women pursuing technical education in diploma and degree engineering.",
      awardAmount: 50000.0,
      awardDetails: "₹50,000 per annum for college fee, computer, books & equipment.",
      officialUrl: "https://www.aicte-india.org/schemes/students-development-schemes/Pragati",
      isActive: true,
      criteria: {
        create: {
          minAcademicScore: 60.0,
          maxFamilyIncome: 800000.0,
          allowedCourses: ["B.Tech", "Engineering", "Diploma"],
          allowedStates: ["ALL"],
          allowedCategories: ["ALL"],
          genderRestriction: "FEMALE_ONLY",
        },
      },
      deadlines: {
        create: {
          academicYear: "2026-2027",
          startDate: new Date("2026-09-15"),
          endDate: new Date("2026-12-10"),
          status: "OPEN",
        },
      },
    },
  });

  // Seed 4: HDFC Bank Parivartan's ECSS Programme for B.Tech
  await prisma.scholarship.upsert({
    where: { slug: "hdfc-bank-parivartan-ecss-btech" },
    update: {},
    create: {
      title: "HDFC Bank Parivartan's ECSS Programme for B.Tech",
      slug: "hdfc-bank-parivartan-ecss-btech",
      provider: "HDFC Bank Parivartan (Buddy4Study Partner)",
      category: "Corporate",
      description: "Financial assistance for meritorious engineering students facing socio-economic crisis.",
      awardAmount: 75000.0,
      awardDetails: "₹75,000 per annum for 4-year B.Tech degree.",
      officialUrl: "https://www.buddy4study.com/page/hdfc-bank-parivartans-ecss-programme",
      isActive: true,
      criteria: {
        create: {
          minAcademicScore: 55.0,
          maxFamilyIncome: 250000.0,
          allowedCourses: ["B.Tech", "BE", "Engineering"],
          allowedStates: ["ALL"],
          allowedCategories: ["ALL"],
          genderRestriction: "ALL",
        },
      },
      deadlines: {
        create: {
          academicYear: "2026-2027",
          startDate: new Date("2026-08-01"),
          endDate: new Date("2026-12-31"),
          status: "OPEN",
        },
      },
    },
  });

  // Seed 5: Kotak Kanya Scholarship for Female B.Tech Students
  await prisma.scholarship.upsert({
    where: { slug: "kotak-kanya-scholarship-btech" },
    update: {},
    create: {
      title: "Kotak Kanya Scholarship for Female B.Tech Students",
      slug: "kotak-kanya-scholarship-btech",
      provider: "Kotak Education Foundation (Buddy4Study Partner)",
      category: "Corporate",
      description: "Empowering meritorious female students pursuing 1st year B.Tech degree in premier institutes.",
      awardAmount: 150000.0,
      awardDetails: "₹1,50,000 per annum until completion of degree.",
      officialUrl: "https://www.buddy4study.com/page/kotak-kanya-scholarship",
      isActive: true,
      criteria: {
        create: {
          minAcademicScore: 85.0,
          maxFamilyIncome: 600000.0,
          allowedCourses: ["B.Tech", "BE"],
          allowedStates: ["ALL"],
          allowedCategories: ["ALL"],
          genderRestriction: "FEMALE_ONLY",
        },
      },
      deadlines: {
        create: {
          academicYear: "2026-2027",
          startDate: new Date("2026-08-15"),
          endDate: new Date("2026-11-15"),
          status: "OPEN",
        },
      },
    },
  });

  // Seed 6: Keep India Smiling Foundational Scholarship (Colgate B.Tech)
  await prisma.scholarship.upsert({
    where: { slug: "colgate-keep-india-smiling-btech" },
    update: {},
    create: {
      title: "Keep India Smiling Foundational Scholarship (Colgate B.Tech)",
      slug: "colgate-keep-india-smiling-btech",
      provider: "Colgate-Palmolive India (Buddy4Study Partner)",
      category: "Corporate",
      description: "Financial foundation support for deserving engineering undergraduates.",
      awardAmount: 50000.0,
      awardDetails: "₹50,000 per annum for 4 years.",
      officialUrl: "https://www.buddy4study.com/page/keep-india-smiling-foundational-scholarship-programme",
      isActive: true,
      criteria: {
        create: {
          minAcademicScore: 60.0,
          maxFamilyIncome: 500000.0,
          allowedCourses: ["B.Tech", "BE"],
          allowedStates: ["ALL"],
          allowedCategories: ["ALL"],
          genderRestriction: "ALL",
        },
      },
      deadlines: {
        create: {
          academicYear: "2026-2027",
          startDate: new Date("2026-07-01"),
          endDate: new Date("2026-10-31"),
          status: "OPEN",
        },
      },
    },
  });

  // Seed 7: Santoor Scholarship for Women in Engineering
  await prisma.scholarship.upsert({
    where: { slug: "santoor-women-scholarship-btech" },
    update: {},
    create: {
      title: "Santoor Scholarship for Women in STEM",
      slug: "santoor-women-scholarship-btech",
      provider: "Wipro Cares & Azim Premji Foundation",
      category: "Private",
      description: "Supporting underprivileged female students pursuing higher education in STEM/Engineering.",
      awardAmount: 24000.0,
      awardDetails: "₹24,000 per annum for tuition & study expenses.",
      officialUrl: "http://www.santoorscholarship.com/",
      isActive: true,
      criteria: {
        create: {
          minAcademicScore: 60.0,
          maxFamilyIncome: 400000.0,
          allowedCourses: ["B.Tech", "BE", "B.Sc"],
          allowedStates: ["ALL"],
          allowedCategories: ["ALL"],
          genderRestriction: "FEMALE_ONLY",
        },
      },
      deadlines: {
        create: {
          academicYear: "2026-2027",
          startDate: new Date("2026-08-01"),
          endDate: new Date("2026-11-30"),
          status: "OPEN",
        },
      },
    },
  });

  console.log("✅ Expanded B.Tech Scholarship Catalog Seeding Complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
