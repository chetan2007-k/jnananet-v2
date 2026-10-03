import React from "react";
import { CalendarDays, Clock, CheckCircle2 } from "lucide-react";

export const CalendarView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-brand-600" />
            Timeline & Deadlines
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Track upcoming scholarship deadlines and document cutoff dates.
          </p>
        </div>
      </div>

      <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-brand-50 flex items-center justify-center mx-auto mb-4">
          <CalendarDays className="w-8 h-8 text-brand-500" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 ">Interactive Calendar Coming Soon</h3>
        <p className="text-slate-500 max-w-md mx-auto text-sm">
          We are building a smart calendar that automatically imports deadlines for scholarships you've matched with. You'll soon be able to set WhatsApp and Email reminders!
        </p>
      </div>

      <div className="space-y-4">
        <h4 className="font-bold text-slate-800 ">Upcoming Deadlines (Preview)</h4>
        
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-amber-50 flex flex-col items-center justify-center border border-amber-100">
              <span className="text-xs font-bold text-amber-600 uppercase">Oct</span>
              <span className="text-lg font-black text-amber-700 leading-none">15</span>
            </div>
            <div>
              <h5 className="font-bold text-slate-900 ">Reliance Foundation UG Scholarship</h5>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                <Clock className="w-3.5 h-3.5" /> 16 Days Remaining
              </p>
            </div>
          </div>
          <button className="px-4 py-2 rounded-lg bg-slate-50 text-slate-700 font-bold text-sm hover:bg-slate-100 border border-slate-200 transition">
            Set Alert
          </button>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-slate-50 flex flex-col items-center justify-center border border-slate-200 ">
              <span className="text-xs font-bold text-slate-500 uppercase">Nov</span>
              <span className="text-lg font-black text-slate-700 leading-none">30</span>
            </div>
            <div>
              <h5 className="font-bold text-slate-900 ">National Scholarship Portal</h5>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Documents Ready
              </p>
            </div>
          </div>
          <button className="px-4 py-2 rounded-lg bg-slate-50 text-slate-700 font-bold text-sm hover:bg-slate-100 border border-slate-200 transition">
            Set Alert
          </button>
        </div>

      </div>
    </div>
  );
};
