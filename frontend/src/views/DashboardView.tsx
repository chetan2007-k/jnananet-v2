import React from "react";
import { useAppStore } from "../store/useAppStore";
import {
  Trophy,
  Sparkles,
  FileText,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

export const DashboardView: React.FC = () => {
  const { profile, setActiveTab, setSelectedScholarship, addToComparison } = useAppStore();

  const metrics = [
    { title: "Scholarships Matched", value: "24", icon: <Trophy className="w-5 h-5 text-amber-400" />, trend: "+3 new this week" },
    { title: "High Probability Fit", value: "8", icon: <Sparkles className="w-5 h-5 text-emerald-400" />, trend: "Score >= 85%" },
    { title: "Active Applications", value: "4", icon: <FileText className="w-5 h-5 text-indigo-400" />, trend: "1 Submitted, 3 Drafts" },
    { title: "Profile Strength", value: "82%", icon: <ShieldCheck className="w-5 h-5 text-purple-400" />, trend: "Complete documents vault" },
  ];

  const featuredMatches = [
    {
      id: "schol-nsp-01",
      title: "National Scholarship Portal - Central Sector Scheme",
      provider: "Government of India (Ministry of Education)",
      amount: "₹12,000 / year",
      matchScore: 92,
      recommendationTag: "HIGH_PROBABILITY",
      deadline: "30 Nov 2026",
      officialUrl: "https://scholarships.gov.in/",
      minMarks: 60,
      maxIncome: 450000,
      allowedCourses: ["B.Tech", "B.Sc", "B.Com", "BA", "MBBS"],
      allowedStates: ["ALL"],
      allowedCategories: ["ALL"],
      category: "Government",
      description: "Financial assistance for meritorious students from low-income families to pursue higher education.",
    },
    {
      id: "schol-reliance-02",
      title: "Reliance Foundation Undergraduate Scholarship",
      provider: "Reliance Foundation",
      amount: "₹2,00,000 (Full Degree)",
      matchScore: 85,
      recommendationTag: "HIGH_PROBABILITY",
      deadline: "15 Oct 2026",
      officialUrl: "https://www.scholarships.reliancefoundation.org/",
      minMarks: 60,
      maxIncome: 600000,
      allowedCourses: ["ALL"],
      allowedStates: ["ALL"],
      allowedCategories: ["ALL"],
      category: "Corporate",
      description: "Empowering meritorious undergraduate students in any discipline across India.",
    },
    {
      id: "schol-aicte-03",
      title: "AICTE Pragati Scholarship Scheme for Girl Students",
      provider: "AICTE",
      amount: "₹50,000 / year",
      matchScore: 78,
      recommendationTag: "STRONG_MATCH",
      deadline: "10 Dec 2026",
      officialUrl: "https://www.aicte-india.org/",
      minMarks: 60,
      maxIncome: 800000,
      allowedCourses: ["B.Tech", "Engineering"],
      allowedStates: ["ALL"],
      allowedCategories: ["ALL"],
      category: "Government",
      description: "Supporting young women pursuing technical education in engineering.",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-brand-600 via-indigo-700 to-brand-800 relative overflow-hidden shadow-xl shadow-brand-500/20">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-semibold mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-brand-200" /> AI Intelligence Operational
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">
            Welcome back, {profile.fullName}!
          </h2>
          <p className="text-brand-100 text-sm leading-relaxed mb-6 font-medium">
            Your profile matches <strong className="text-white bg-white/20 px-1.5 rounded">24 scholarships</strong> worth up to <strong className="text-emerald-300">₹2,00,000</strong>. Your deterministic score is verified with high probability for central government and corporate funding.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab("scholarships")}
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-brand-700 font-bold text-sm flex items-center gap-2 shadow-lg transition transform hover:-translate-y-0.5"
            >
              Explore Matches <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab("assistant")}
              className="px-5 py-2.5 rounded-xl bg-brand-700/50 hover:bg-brand-700/70 text-white font-semibold text-sm border border-brand-400/30 backdrop-blur-md transition"
            >
              Ask AI Assistant
            </button>
          </div>
        </div>
      </div>

      {/* Scholarship Scrolling Ticker Banner */}
      <div className="relative flex overflow-x-hidden rounded-xl bg-brand-50 border border-brand-100 py-3 shadow-sm">
        <div className="flex w-max animate-marquee space-x-8 whitespace-nowrap px-4 items-center">
          {[
            "🌟 NEW: HDFC Bank Parivartan's ECS Scholarship - Up to ₹55,000",
            "🚀 DEADLINE APPROACHING: Reliance Foundation UG Scholarship (15 Oct)",
            "✨ FRESH LISTING: Kotak Kanya Scholarship for Female Students - Up to ₹1.5 Lakh",
            "🎓 APPLY NOW: Keep India Smiling Foundational Scholarship - ₹30,000/yr",
            "📈 HIGH MATCH: SBI Asha Scholarship Program - ₹50,000",
          ].map((item, i) => (
            <React.Fragment key={i}>
              <span className="text-sm font-semibold text-brand-900 tracking-wide cursor-pointer hover:text-brand-600 transition-colors" onClick={() => setActiveTab("scholarships")}>{item}</span>
              <span className="text-brand-300">◆</span>
            </React.Fragment>
          ))}
          {/* Duplicate for seamless infinite scrolling */}
          {[
            "🌟 NEW: HDFC Bank Parivartan's ECS Scholarship - Up to ₹55,000",
            "🚀 DEADLINE APPROACHING: Reliance Foundation UG Scholarship (15 Oct)",
            "✨ FRESH LISTING: Kotak Kanya Scholarship for Female Students - Up to ₹1.5 Lakh",
            "🎓 APPLY NOW: Keep India Smiling Foundational Scholarship - ₹30,000/yr",
            "📈 HIGH MATCH: SBI Asha Scholarship Program - ₹50,000",
          ].map((item, i) => (
            <React.Fragment key={`dup-${i}`}>
              <span className="text-sm font-semibold text-brand-900 tracking-wide cursor-pointer hover:text-brand-600 transition-colors" onClick={() => setActiveTab("scholarships")}>{item}</span>
              <span className="text-brand-300">◆</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Top 4 Metrics Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, idx) => (
          <div key={idx} className="p-5 rounded-2xl glass-card flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400">{m.title}</span>
              <div className="p-2 rounded-xl bg-slate-50/80">{m.icon}</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-slate-900 tracking-tight">{m.value}</div>
              <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-400" /> {m.trend}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* High Probability Scholarships */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" /> Top Match Opportunities
          </h3>
          <button
            onClick={() => setActiveTab("scholarships")}
            className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1"
          >
            View Catalog <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featuredMatches.map((s) => (
            <div key={s.id} className="p-5 rounded-2xl glass-card flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {s.matchScore}% Match
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">{s.category}</span>
                </div>
                <h4 className="font-bold text-base text-slate-900 line-clamp-2 mb-1">{s.title}</h4>
                <p className="text-xs text-slate-400 mb-3">{s.provider}</p>
                <div className="text-lg font-extrabold text-emerald-400">{s.amount}</div>
              </div>

              <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-amber-400" /> {s.deadline}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => addToComparison(s as any)}
                    className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 font-medium transition"
                  >
                    + Compare
                  </button>
                  <button
                    onClick={() => setSelectedScholarship(s as any)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-slate-900 font-medium transition"
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Action Hub & Readiness Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Gamified Profile Completeness Unlock Mechanic */}
        <div className="p-5 rounded-2xl glass-panel space-y-4 border border-brand-500/20 relative overflow-hidden bg-white shadow-sm hover:shadow-md transition">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <Trophy className="w-32 h-32 text-brand-600" />
          </div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 relative z-10">
            <Sparkles className="w-5 h-5 text-amber-400" /> Unlock More Funding
          </h3>
          
          <div className="flex items-center gap-5 relative z-10 my-4">
            {/* Circular Progress Bar CSS Hack using conic-gradient */}
            <div className="relative w-20 h-20 rounded-full flex items-center justify-center shrink-0 shadow-inner" style={{ background: 'conic-gradient(#6366f1 65%, #e2e8f0 0)' }}>
              <div className="w-16 h-16 rounded-full bg-white flex flex-col items-center justify-center shadow-md">
                <span className="text-lg font-black text-slate-900">65%</span>
              </div>
            </div>
            
            <div className="space-y-1.5">
              <h4 className="font-bold text-sm text-slate-900">Your profile is 65% complete.</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Upload your <strong className="text-slate-900">Income Certificate</strong> to instantly unlock <strong className="text-brand-600 font-bold">14 new Government Scholarships</strong> worth over <strong className="text-emerald-500 font-bold">₹1.2 Lakhs</strong>.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab("identity")}
            className="w-full py-2.5 mt-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-xs font-bold text-white transition shadow-md shadow-brand-500/20 relative z-10 flex items-center justify-center gap-2"
          >
            Upload Documents Now <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* AI Outcome Prediction Engine */}
        <div className="p-5 rounded-2xl glass-panel space-y-4 border border-purple-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <Trophy className="w-24 h-24" />
          </div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 relative z-10">
            <Sparkles className="w-5 h-5 text-purple-400" /> AI Outcome Prediction
          </h3>
          <p className="text-xs text-slate-600 relative z-10">
            Based on historical data and your current profile strength, our ML models predict your selection probability for active applications.
          </p>
          
          <div className="space-y-3 mt-4 relative z-10">
            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-300 ">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-slate-900 ">NSP Central Sector Scheme</span>
                <span className="text-xs font-extrabold text-emerald-400">92% Win Probability</span>
              </div>
              <div className="w-full bg-white rounded-full h-1.5">
                <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
            
            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-300 ">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-slate-900 ">Reliance Foundation UG</span>
                <span className="text-xs font-extrabold text-brand-400">76% Win Probability</span>
              </div>
              <div className="w-full bg-white rounded-full h-1.5">
                <div className="bg-brand-400 h-1.5 rounded-full" style={{ width: '76%' }}></div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab("simulator")}
            className="w-full py-2 mt-2 rounded-xl bg-gradient-to-r from-purple-600 to-brand-600 hover:from-purple-500 hover:to-brand-500 text-xs font-semibold text-white shadow-md transition relative z-10"
          >
            Run What-If Simulator
          </button>
        </div>
      </div>
    </div>
  );
};
