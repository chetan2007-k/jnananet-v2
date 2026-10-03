import React from "react";
import { useAppStore } from "../store/useAppStore";
import { Scale, X, CheckCircle2, AlertTriangle, ExternalLink } from "lucide-react";

interface ComparisonDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ComparisonDrawer: React.FC<ComparisonDrawerProps> = ({ isOpen, onClose }) => {
  const { comparisonList, removeFromComparison, clearComparison, setActiveTab } = useAppStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="relative w-full max-w-3xl h-full bg-white shadow-2xl overflow-y-auto border-l border-slate-200 transform transition-transform duration-300">
        <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-slate-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Scale className="w-5 h-5 text-brand-600" /> Compare Scholarships
            </h2>
            <p className="text-xs text-slate-500 mt-1">Comparing {comparisonList.length} shortlisted opportunities</p>
          </div>
          <div className="flex items-center gap-3">
            {comparisonList.length > 0 && (
              <button
                onClick={clearComparison}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {comparisonList.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 mx-auto flex items-center justify-center">
                <Scale className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 ">No Scholarships Selected</h3>
              <p className="text-sm text-slate-500 max-w-xs mx-auto">
                Select 2 to 4 scholarships from the catalog to compare financial benefits and criteria side-by-side.
              </p>
              <button
                onClick={() => {
                  setActiveTab("scholarships");
                  onClose();
                }}
                className="mt-4 px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm shadow-md transition"
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr>
                    <th className="p-4 bg-slate-50 text-xs font-bold text-slate-500 border-b border-r border-slate-200 w-48 sticky left-0 z-10">
                      Criteria Dimension
                    </th>
                    {comparisonList.map((s) => (
                      <th key={s.id} className="p-4 bg-white border-b border-slate-200 relative align-top min-w-[200px]">
                        <button
                          onClick={() => removeFromComparison(s.id)}
                          className="absolute top-2 right-2 p-1 text-slate-300 hover:bg-slate-100 rounded-md hover:text-red-500 transition"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <div className="text-sm font-extrabold text-slate-900 mb-1 pr-6 leading-tight">{s.title}</div>
                        <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wide">{s.provider}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  <tr>
                    <td className="p-4 font-bold text-slate-600 bg-slate-50 border-r border-slate-200 sticky left-0 z-10">
                      Financial Benefit
                    </td>
                    {comparisonList.map((s) => (
                      <td key={s.id} className="p-4 font-extrabold text-emerald-600 bg-emerald-50/30">
                        ₹{s.awardAmount.toLocaleString("en-IN")}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-slate-600 bg-slate-50 border-r border-slate-200 sticky left-0 z-10">
                      Min Academic Score
                    </td>
                    {comparisonList.map((s) => (
                      <td key={s.id} className="p-4 font-semibold text-slate-800 ">
                        {s.minMarks}%
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-slate-600 bg-slate-50 border-r border-slate-200 sticky left-0 z-10">
                      Max Family Income
                    </td>
                    {comparisonList.map((s) => (
                      <td key={s.id} className="p-4 font-semibold text-slate-800 ">
                        ₹{s.maxIncome.toLocaleString("en-IN")}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-slate-600 bg-slate-50 border-r border-slate-200 sticky left-0 z-10">
                      Allowed Courses
                    </td>
                    {comparisonList.map((s) => (
                      <td key={s.id} className="p-4 text-sm text-slate-600 ">
                        {s.allowedCourses.join(", ")}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-slate-600 bg-slate-50 border-r border-slate-200 sticky left-0 z-10">
                      Match Probability
                    </td>
                    {comparisonList.map((s) => (
                      <td key={s.id} className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200">
                          {s.matchScore || 85}% Match
                        </span>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
