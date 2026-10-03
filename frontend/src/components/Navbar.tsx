import React, { useState } from "react";
import { useAppStore } from "../store/useAppStore";
import { Bell, Scale, Sparkles, User, LogIn, Globe } from "lucide-react";
import { AuthModal } from "./AuthModal";
import { ComparisonDrawer } from "../views/ComparisonView";

export const Navbar: React.FC = () => {
  const { activeTab, setActiveTab, comparisonList, profile } = useAppStore();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [language, setLanguage] = useState("EN");

  const getTitle = () => {
    switch (activeTab) {
      case "dashboard": return "Student Intelligence Dashboard";
      case "scholarships": return "Scholarships Catalog & Matcher";
      case "simulator": return "What-If Profile Simulator";
      case "identity": return "My Identity Hub";
      case "calendar": return "Timeline & Deadlines";
      case "assistant": return "AI Assistant & Reviewer";
      case "applications": return "My Applications & Readiness Tracker";
      default: return "JnanaNet V2";
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 h-16 glass-panel border-b border-slate-200/80 px-4 md:px-6 flex items-center justify-between overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 md:gap-4 flex-shrink-0 min-w-0 pr-2">
          <h1 className="text-base md:text-xl font-extrabold text-slate-900 tracking-tight truncate max-w-[150px] sm:max-w-xs md:max-w-md">
            {getTitle()}
          </h1>
          <span className="hidden lg:inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
            <Sparkles className="w-3 h-3" /> Smart Match Active
          </span>
        </div>

        <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
          {/* Multilingual Toggle */}
          <div className="relative group hidden sm:block">
            <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-medium border border-slate-200 transition">
              <Globe className="w-4 h-4 text-slate-500 " />
              <span className="hidden md:inline">{language}</span>
            </button>
            <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-lg border border-slate-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <div className="py-1">
                {["EN (English)", "HI (हिंदी)", "TE (తెలుగు)", "TA (தமிழ்)"].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang.split(" ")[0])}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-700"
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Comparison Drawer Launcher */}
          <button
            onClick={() => setIsComparisonOpen(true)}
            className="relative flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium border border-slate-200 shadow-sm transition"
          >
            <Scale className="w-4 h-4 text-brand-500" />
            <span className="hidden md:inline">Compare</span>
            {comparisonList.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs font-bold bg-brand-100 text-brand-700 rounded-full">
                {comparisonList.length}
              </span>
            )}
          </button>

          {/* Student Login / Account Button */}
          <button
            onClick={() => setIsAuthOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm text-xs font-semibold transition"
          >
            <LogIn className="w-4 h-4 text-slate-400" /> 
            <span className="hidden sm:inline">Login</span>
          </button>

          {/* Profile Avatar Badge */}
          <button
            onClick={() => setActiveTab("identity")}
            className="flex items-center gap-2 pl-1.5 pr-2 py-1.5 md:pl-2 md:pr-3 rounded-full bg-white border border-slate-200 shadow-sm hover:border-brand-300 transition"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {profile.fullName ? profile.fullName.charAt(0) : "S"}
            </div>
            <span className="text-sm font-medium text-slate-800 hidden lg:inline max-w-[100px] truncate">
              {profile.fullName || "Student"}
            </span>
          </button>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      {/* Comparison Slide-Out Drawer */}
      <ComparisonDrawer isOpen={isComparisonOpen} onClose={() => setIsComparisonOpen(false)} />
    </>
  );
};
