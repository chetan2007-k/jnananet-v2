import React, { useState } from "react";
import { ProfileView } from "./ProfileView";
import { DocumentsVaultView } from "./DocumentsVaultView";
import { Fingerprint, FolderLock, User } from "lucide-react";

export const IdentityHubView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<"profile" | "documents">("profile");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Fingerprint className="w-6 h-6 text-brand-600" />
            My Identity Hub
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Manage your personal data and verify your supporting documents in one place.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-slate-200 ">
        <button
          onClick={() => setActiveSubTab("profile")}
          className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeSubTab === "profile"
              ? "border-brand-600 text-brand-700"
              : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
          }`}
        >
          <User className="w-4 h-4" /> Personal Details
        </button>
        <button
          onClick={() => setActiveSubTab("documents")}
          className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeSubTab === "documents"
              ? "border-brand-600 text-brand-700"
              : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
          }`}
        >
          <FolderLock className="w-4 h-4" /> Verified Documents
        </button>
      </div>

      <div className="pt-2">
        {activeSubTab === "profile" ? <ProfileView /> : <DocumentsVaultView />}
      </div>
    </div>
  );
};
