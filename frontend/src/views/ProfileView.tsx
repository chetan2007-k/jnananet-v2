import React, { useState } from "react";
import { useAppStore } from "../store/useAppStore";
import { User, BookOpen, Landmark, ShieldCheck, CheckCircle2, Save } from "lucide-react";

export const ProfileView: React.FC = () => {
  const { profile, updateProfile } = useAppStore();

  const [fullName, setFullName] = useState(profile.fullName);
  const [phone, setPhone] = useState(profile.phone || "");
  const [state, setState] = useState(profile.state);
  const [district, setDistrict] = useState(profile.district);
  const [category, setCategory] = useState(profile.category);

  const [courseName, setCourseName] = useState(profile.academicRecord?.courseName || "B.Tech Computer Science");
  const [institutionName, setInstitutionName] = useState(profile.academicRecord?.institutionName || "Anna University");
  const [scoreObtained, setScoreObtained] = useState(profile.academicRecord?.scoreObtained || 82.5);

  const [annualFamilyIncome, setAnnualFamilyIncome] = useState(profile.financialProfile?.annualFamilyIncome || 280000);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    updateProfile({
      fullName,
      phone,
      state,
      district,
      category: category as any,
      academicRecord: {
        currentLevel: "Undergraduate",
        courseName,
        institutionName,
        boardOrUniversity: institutionName,
        yearOfStudy: 2,
        scoreObtained: Number(scoreObtained),
        maxScore: 100,
      },
      financialProfile: {
        annualFamilyIncome: Number(annualFamilyIncome),
        hasIncomeCertificate: true,
      },
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header & Completeness */}
      <div className="p-6 rounded-2xl glass-panel flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 ">Student Profile & Eligibility Data Matrix</h2>
          <p className="text-xs text-slate-400">Keep your academic and financial records updated for deterministic matching</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-slate-400 block">Profile Strength</span>
            <span className="text-xl font-extrabold text-emerald-400">82%</span>
          </div>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-slate-900 font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-brand-600/25 transition"
          >
            <Save className="w-4 h-4" /> Save Profile
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> Profile updated successfully! Re-evaluating scholarship eligibility...
        </div>
      )}

      {/* Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Details */}
        <div className="p-6 rounded-2xl glass-card space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <User className="w-5 h-5 text-brand-400" /> Personal & Demographic Details
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 "
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 "
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-400 block mb-1">State</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 "
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">District</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 "
                />
              </div>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 "
              >
                <option value="GENERAL">General</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="EWS">EWS</option>
              </select>
            </div>
          </div>
        </div>

        {/* Academic & Financial Records */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl glass-card space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-400" /> Academic Performance
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Enrolled Course</label>
                <input
                  type="text"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 "
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Institution Name</label>
                <input
                  type="text"
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 "
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Aggregate Score Obtained (%)</label>
                <input
                  type="number"
                  value={scoreObtained}
                  onChange={(e) => setScoreObtained(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 "
                />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl glass-card space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Landmark className="w-5 h-5 text-emerald-400" /> Family Financial Standing
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Annual Family Income (₹)</label>
                <input
                  type="number"
                  value={annualFamilyIncome}
                  onChange={(e) => setAnnualFamilyIncome(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 font-bold text-emerald-400"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
