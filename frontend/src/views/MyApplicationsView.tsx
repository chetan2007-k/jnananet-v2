import React from "react";
import { useAppStore } from "../store/useAppStore";
import { FileCheck2, Clock, CheckCircle2, AlertCircle, ArrowUpRight } from "lucide-react";

export const MyApplicationsView: React.FC = () => {
  const { applications } = useAppStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 ">My Scholarship Applications</h2>
          <p className="text-xs text-slate-400">Track application lifecycle, document readiness, and portal status</p>
        </div>
      </div>

      <div className="space-y-4">
        {applications.length === 0 ? (
          <div className="p-12 rounded-2xl glass-panel flex flex-col items-center justify-center text-center">
            <FileCheck2 className="w-12 h-12 text-slate-600 mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">No Applications Yet</h3>
            <p className="text-sm text-slate-400 max-w-sm">
              You haven't started any scholarship applications. Go to the Scholarships tab to explore matches and start tracking them here.
            </p>
          </div>
        ) : (
          applications.map((app) => (
            <div key={app.id} className="p-6 rounded-2xl glass-card flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all duration-300">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      app.status === "SUBMITTED"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}
                  >
                    {app.status}
                  </span>
                  <span className="text-xs text-slate-400">{app.provider}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 ">{app.scholarshipTitle}</h3>
                <div className="text-sm font-extrabold text-emerald-400">
                  ₹{app.awardAmount.toLocaleString("en-IN")}
                </div>
              </div>

              <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                <div className="text-right">
                  <span className="text-xs text-slate-400 block mb-0.5">Readiness Score</span>
                  <span className="text-lg font-extrabold text-brand-400">{app.readinessScore}%</span>
                </div>

                <button className="px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-800 transition flex items-center gap-1">
                  View Tracker <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
