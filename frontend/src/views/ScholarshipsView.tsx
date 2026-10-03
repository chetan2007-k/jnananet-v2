import React, { useState, useEffect } from "react";
import { useAppStore } from "../store/useAppStore";
import { Scholarship } from "../types";
import {
  Search,
  Filter,
  Sparkles,
  Scale,
  ExternalLink,
  X,
  CheckCircle2,
  Clock,
  BookOpen,
  Building2,
} from "lucide-react";

export const ScholarshipsView: React.FC = () => {
  const {
    addToComparison,
    selectedScholarship,
    setSelectedScholarship,
  } = useAppStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [courseFilter, setCourseFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [isMagicApplyOpen, setIsMagicApplyOpen] = useState(false);
  const [magicProgress, setMagicProgress] = useState(0);

  const handleMagicApply = () => {
    setIsMagicApplyOpen(true);
    setMagicProgress(0);
    
    // Simulate extension loading progress
    let prog = 0;
    const interval = setInterval(() => {
      prog += 20;
      setMagicProgress(prog);
      if (prog >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          if (selectedScholarship?.officialUrl) {
            window.open(selectedScholarship.officialUrl, "_blank");
          }
          setIsMagicApplyOpen(false);
        }, 1000);
      }
    }, 600);
  };

  const initialCatalog: Scholarship[] = [
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
      allowedCourses: ["B.Tech", "Engineering"],
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
  const [catalog, setCatalog] = useState<Scholarship[]>(initialCatalog);

  useEffect(() => {
    fetch('http://localhost:5000/api/scholarships')
      .then(res => res.json())
      .then(data => {
        if(data && Array.isArray(data) && data.length > 0) {
           const dbScholarships = data.map((item: any) => ({
              id: item.id || `neon-${Date.now()}`,
              title: item.title,
              slug: item.id,
              provider: item.provider,
              category: item.category,
              description: "✨ Live from Neon Database!",
              awardAmount: item.award_amount,
              awardDetails: `₹${item.award_amount?.toLocaleString("en-IN")}`,
              officialUrl: item.official_url || "https://scholarships.gov.in/",
              minMarks: item.min_marks_required || 60,
              maxIncome: item.max_income_allowed || 500000,
              allowedCourses: ["ALL"],
              allowedStates: ["ALL"],
              allowedCategories: ["ALL"],
              deadlineDate: item.deadline_date ? item.deadline_date.substring(0, 10) : "2026-11-30",
              isEligible: true,
              matchScore: 99,
              recommendationTag: "HIGH_PROBABILITY" as any
           }));
           
           setCatalog(prev => {
             const existingIds = new Set(prev.map(p => p.id));
             const newItems = dbScholarships.filter((db: Scholarship) => !existingIds.has(db.id));
             // Replace item with same ID, or prepend new ones
             const updatedPrev = prev.map(p => {
               const match = dbScholarships.find((db: Scholarship) => db.id === p.id);
               return match ? match : p;
             });
             return [...newItems, ...updatedPrev];
           });
        }
      })
      .catch(err => console.log('Backend not running or unreachable', err));
  }, []);

  const filtered = catalog.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.provider.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse =
      courseFilter === "ALL" ||
      s.allowedCourses.includes("ALL") ||
      s.allowedCourses.some((c) => c.toLowerCase().includes(courseFilter.toLowerCase()));
    const matchesCategory = categoryFilter === "ALL" || s.category === categoryFilter;

    return matchesSearch && matchesCourse && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl glass-panel flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by scholarship title, provider..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-brand-500"
          >
            <option value="ALL">All Courses</option>
            <option value="B.Tech">B.Tech / Engineering</option>
            <option value="B.Sc">B.Sc Science</option>
            <option value="MBBS">MBBS Medical</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-brand-500"
          >
            <option value="ALL">All Categories</option>
            <option value="Government">Government</option>
            <option value="Corporate">Corporate</option>
            <option value="Private">Private Trusts</option>
          </select>
        </div>
      </div>

    {/* Grid of Scholarship Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((s) => (
          <div key={s.id} className="group p-6 rounded-2xl glass-card hover:bg-slate-50/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-5 border-t-2 border-t-transparent hover:border-t-brand-500 shadow-lg hover:shadow-brand-500/10">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                  (s.matchScore || 0) >= 85 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                  (s.matchScore || 0) >= 75 ? 'bg-brand-500/10 text-brand-400 border-brand-500/20' :
                  'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}>
                  {s.matchScore || 0}% Match
                </span>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold bg-white/50 px-2 py-1 rounded-md">{s.category}</span>
              </div>
              <h3 className="font-extrabold text-lg text-slate-900 mb-1.5 leading-tight group-hover:text-brand-300 transition-colors">{s.title}</h3>
              <p className="text-xs font-medium text-slate-400 mb-3 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" /> {s.provider}
              </p>
              <p className="text-sm text-slate-600 line-clamp-2 mb-5 leading-relaxed">{s.description}</p>

              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-white/80 border border-slate-200/80 text-xs mb-2">
                <div>
                  <span className="text-slate-400 block mb-0.5">Min Score</span>
                  <span className="font-bold text-slate-800 text-sm">{s.minMarks}%</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Max Income</span>
                  <span className="font-bold text-slate-800 text-sm">₹{s.maxIncome.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold mb-0.5">Award up to</div>
                <div className="text-lg font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  ₹{s.awardAmount.toLocaleString("en-IN")}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => addToComparison(s)}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 transition"
                  title="Compare"
                >
                  <Scale className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedScholarship(s)}
                  className="text-xs px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold shadow-md shadow-brand-600/20 transition flex items-center gap-1"
                >
                  Details <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Details Modal */}
      {selectedScholarship && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-2xl glass-panel border border-slate-300 p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-500/10 text-brand-400 border border-brand-500/20 mb-2 inline-block">
                  {selectedScholarship.category} Program
                </span>
                <h3 className="text-xl font-bold text-slate-900 ">{selectedScholarship.title}</h3>
                <p className="text-xs text-slate-400 mt-1">{selectedScholarship.provider}</p>
              </div>
              <button
                onClick={() => setSelectedScholarship(null)}
                className="p-1.5 rounded-lg bg-slate-50 text-slate-400 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-white/80 border border-slate-200 space-y-2">
              <div className="text-xs text-slate-400">Award Financial Benefit</div>
              <div className="text-2xl font-extrabold text-emerald-400">
                ₹{selectedScholarship.awardAmount.toLocaleString("en-IN")}
              </div>
              {selectedScholarship.awardDetails && (
                <p className="text-xs text-slate-600 ">{selectedScholarship.awardDetails}</p>
              )}
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-bold text-slate-900 ">Eligibility Breakdown</h4>
              <ul className="space-y-1.5 text-xs text-slate-600 ">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Minimum Academic Marks: {selectedScholarship.minMarks}%
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Maximum Annual Income: ₹{selectedScholarship.maxIncome.toLocaleString("en-IN")}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Allowed Courses: {selectedScholarship.allowedCourses.join(", ")}
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <a
                href={selectedScholarship.officialUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-brand-400 hover:underline flex items-center gap-1"
              >
                Manual Portal Link <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedScholarship(null)}
                  className="px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-900 transition"
                >
                  Close
                </button>
                <button
                  onClick={handleMagicApply}
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-xs font-bold text-white flex items-center gap-2 shadow-md transition"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Magic Auto-Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Magic Apply Progress Modal */}
      {isMagicApplyOpen && (
        <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl glass-panel border border-brand-500/30 p-8 space-y-6 text-center animate-in zoom-in-95">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-500/10 flex items-center justify-center animate-pulse">
              <Sparkles className="w-8 h-8 text-brand-400" />
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">JnanaNet Extension</h3>
              <p className="text-sm text-slate-500">
                {magicProgress < 40 ? "Extracting profile identity data..." : 
                 magicProgress < 80 ? "Mapping schema to target portal..." : 
                 "Launching portal for auto-fill!"}
              </p>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
              <div 
                className="bg-brand-500 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${magicProgress}%` }}
              ></div>
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{magicProgress}% Complete</p>
          </div>
        </div>
      )}
    </div>
  );
};
