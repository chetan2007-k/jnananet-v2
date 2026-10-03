import React from "react";
import { useAppStore, TabView } from "../store/useAppStore";
import {
  LayoutDashboard,
  GraduationCap,
  Sliders,
  Bot,
  FileCheck2,
  CalendarDays,
  Fingerprint,
  Zap,
} from "lucide-react";

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, applications } = useAppStore();

  const navItems: Array<{ id: TabView; label: string; icon: React.ReactNode; badge?: string | number }> = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: "scholarships", label: "Scholarships", icon: <GraduationCap className="w-5 h-5" /> },
    { id: "calendar", label: "Timeline & Deadlines", icon: <CalendarDays className="w-5 h-5" /> },
    { id: "simulator", label: "What-If Simulator", icon: <Sliders className="w-5 h-5" /> },
    { id: "applications", label: "My Applications", icon: <FileCheck2 className="w-5 h-5" />, badge: applications.length },
    { id: "identity", label: "My Identity Hub", icon: <Fingerprint className="w-5 h-5" /> },
    { id: "assistant", label: "AI Assistant", icon: <Bot className="w-5 h-5 text-indigo-400" /> },
  ];

  return (
    <aside className="w-64 glass-panel border-r border-slate-200/80 flex flex-col justify-between hidden lg:flex shrink-0">
      <div className="p-4">
        {/* Brand Logo Header */}
        <div className="flex items-center gap-3 px-3 py-3 mb-6 rounded-xl bg-white border border-slate-200 shadow-sm">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-500 flex items-center justify-center shadow-md shadow-brand-500/20">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-heading font-extrabold text-lg text-slate-900 tracking-wide">
              Jnana<span className="text-brand-600">Net V2</span>
            </h2>
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Scholarship Intelligence
            </p>
          </div>
        </div>

        {/* Navigation Item List */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-brand-50 text-brand-700 shadow-sm shadow-brand-100 font-semibold"
                    : "text-slate-600 hover:text-brand-600 hover:bg-slate-100/80"
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      isActive ? "bg-white text-brand-700 shadow-sm" : "bg-slate-200 text-slate-500 "
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Banner */}
      <div className="p-4 m-3 rounded-xl bg-gradient-to-tr from-brand-50 to-indigo-50 border border-brand-100 text-center">
        <p className="text-xs text-brand-700 font-bold">Smart Match Engine</p>
        <p className="text-[11px] text-brand-600 mt-0.5">AI-Guided Recommendations</p>
      </div>
    </aside>
  );
};
