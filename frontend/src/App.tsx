import React from "react";
import { useAppStore } from "./store/useAppStore";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";

import { DashboardView } from "./views/DashboardView";
import { ScholarshipsView } from "./views/ScholarshipsView";
import { WhatIfSimulatorView } from "./views/WhatIfSimulatorView";
import { AiAssistantView } from "./views/AiAssistantView";
import { MyApplicationsView } from "./views/MyApplicationsView";
import { IdentityHubView } from "./views/IdentityHubView";
import { CalendarView } from "./views/CalendarView";

export const App: React.FC = () => {
  const { activeTab, comparisonList } = useAppStore();

  const renderActiveView = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardView />;
      case "scholarships":
        return <ScholarshipsView />;
      case "simulator":
        return <WhatIfSimulatorView />;
      case "assistant":
        return <AiAssistantView />;
      case "applications":
        return <MyApplicationsView />;
      case "identity":
        return <IdentityHubView />;
      case "calendar":
        return <CalendarView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 ">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 overflow-y-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 glass-panel border-t border-slate-200/80 px-2 py-2 flex items-center justify-around z-50 bg-white/90 backdrop-blur-md pb-safe">
        <button onClick={() => useAppStore.getState().setActiveTab("dashboard")} className={`flex flex-col items-center p-2 rounded-lg ${activeTab === 'dashboard' ? 'text-brand-600' : 'text-slate-400'}`}>
          <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
          <span className="text-[10px] font-bold">Home</span>
        </button>
        <button onClick={() => useAppStore.getState().setActiveTab("scholarships")} className={`flex flex-col items-center p-2 rounded-lg ${activeTab === 'scholarships' ? 'text-brand-600' : 'text-slate-400'}`}>
          <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>
          <span className="text-[10px] font-bold">Catalog</span>
        </button>
        <button onClick={() => useAppStore.getState().setActiveTab("assistant")} className={`flex flex-col items-center p-2 rounded-lg ${activeTab === 'assistant' ? 'text-brand-600' : 'text-slate-400'}`}>
          <div className={`w-10 h-10 -mt-5 rounded-full flex items-center justify-center text-white shadow-lg border-4 border-slate-50 ${activeTab === 'assistant' ? 'bg-brand-600' : 'bg-slate-800'}`}>
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <span className="text-[10px] font-bold mt-1">AI</span>
        </button>
        <button onClick={() => useAppStore.getState().setActiveTab("applications")} className={`flex flex-col items-center p-2 rounded-lg ${activeTab === 'applications' ? 'text-brand-600' : 'text-slate-400'}`}>
          <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span className="text-[10px] font-bold">Status</span>
        </button>
        <button onClick={() => useAppStore.getState().setActiveTab("identity")} className={`flex flex-col items-center p-2 rounded-lg ${activeTab === 'identity' ? 'text-brand-600' : 'text-slate-400'}`}>
          <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          <span className="text-[10px] font-bold">Profile</span>
        </button>
      </div>
    </div>
  );
};

export default App;
